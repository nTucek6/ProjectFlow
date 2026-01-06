package com.example.backend.service.implementation;

import com.example.backend.dto.SelectDto;
import com.example.backend.dto.project.ProjectMemberDto;
import com.example.backend.dto.task.CreateTaskDto;
import com.example.backend.dto.task.TaskDto;
import com.example.backend.dto.userActivity.CreateUserActivityDto;
import com.example.backend.dto.userActivity.UserActivityDto;
import com.example.backend.enums.ActivityAction;
import com.example.backend.enums.ProjectStatus;
import com.example.backend.enums.TaskStatus;
import com.example.backend.mapper.TaskMapper;
import com.example.backend.model.table.*;
import com.example.backend.repository.ProjectMilestonesRepository;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.repository.TaskRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.TaskService;
import com.example.backend.service.auth.CustomUserDetails;
import com.example.backend.utils.SecurityUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMilestonesRepository projectMilestonesRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;


    @Override
    @Transactional
    public TaskDto save(CreateTaskDto newTaskDto) {
        Project project = projectRepository.findById(newTaskDto.getProjectId()).orElseThrow(() -> new EntityNotFoundException("Project not found"));

        Task task = new Task();
        task.setTitle(newTaskDto.getTitle());
        task.setProject(project);
        task.setStatus(TaskStatus.TODO);
        task.setDescription(newTaskDto.getDescription());
        task.setCreatedAt(OffsetDateTime.now());
        task.setAssignees(new ArrayList<>());
        int orderMax = taskRepository.findMaxOrderByProjectIdAndStatus(project.getId(), TaskStatus.TODO) + 1;
        task.setOrder(orderMax);
        if (newTaskDto.getProjectMilestoneId() > 0) {
            ProjectMilestones projectMilestone = projectMilestonesRepository.findById(newTaskDto.getProjectMilestoneId())
                    .orElseThrow(() -> new EntityNotFoundException("Project milestone not found!"));
            task.setProjectMilestones(projectMilestone);
        }

        if (!newTaskDto.getAssignees().isEmpty()) {
            List<User> assigneeSet = new ArrayList<>();
            newTaskDto.getAssignees().forEach(a -> {
                User u = userRepository.findById(a.getValue()).orElseThrow();
                assigneeSet.add(u);
            });
            task.setAssignees(assigneeSet);
        }

        Task newTask = taskRepository.save(task);

        CustomUserDetails user = SecurityUtils.getPrincipal();
        eventPublisher.publishEvent(
                new CreateUserActivityDto(
                        user.getId(),
                        newTask.getProject(),
                        ActivityAction.CREATED,
                        user.getFullName()) + " created task: " + task.getTitle()
        );


        return TaskMapper.mapTaskToTaskDto(newTask);
    }

    @Override
    @Transactional
    public TaskDto update(Long id, TaskDto taskDto) {
        Task taskToUpdate = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));

        taskToUpdate.setTitle(taskDto.getTitle());
        taskToUpdate.setDescription(taskDto.getDescription());
        if (taskDto.getCreatedAt() != null) {
            taskToUpdate.setCreatedAt(OffsetDateTime.now());
        }
        if (taskDto.getStatus() != null) {
            TaskStatus status = taskToUpdate.getStatus();
            if (status != taskDto.getStatus()) {
                taskToUpdate.setStatus(taskDto.getStatus());
                CustomUserDetails user = SecurityUtils.getPrincipal();
                String description = user.getFullName() + " changed task status " + taskToUpdate.getTitle() + " to: " + taskToUpdate.getStatus().getDescription();
                eventPublisher.publishEvent(
                        new CreateUserActivityDto(
                                user.getId(),
                                taskToUpdate.getProject(),
                                ActivityAction.STATUS_CHANGED,
                                description
                        )
                );
            }
        }

        if (taskToUpdate.getAssignees() != null && taskDto.getAssignees() != null) {
            syncMembers(taskToUpdate, taskDto.getAssignees());
        }

        return TaskMapper.mapTaskToTaskDto(taskRepository.save(taskToUpdate));
    }

    @Transactional
    @Override
    public void reorder(List<TaskDto> tasksDto) {

        List<Long> ids = tasksDto.stream().map(TaskDto::getId).toList();
        List<Task> tasks = taskRepository.findAllById(ids);

        Map<Long, TaskDto> dtoMap = tasksDto.stream()
                .collect(Collectors.toMap(TaskDto::getId, Function.identity()));

        for (Task task : tasks) {
            TaskDto dto = dtoMap.get(task.getId());
            task.setOrder(dto.getOrder());
        }
        taskRepository.saveAll(tasks);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Task not found"));
        Project project = projectRepository.findById(task.getProject().getId()).orElseThrow(EntityNotFoundException::new);
        project.getTasks().remove(task);
        taskRepository.flush();
        taskRepository.decrementOrdersAfter(project.getId(), task.getStatus(), task.getOrder());

        CustomUserDetails user = SecurityUtils.getPrincipal();

        String description = user.getFullName() + " deleted task: " + task.getTitle();
        eventPublisher.publishEvent(
                new CreateUserActivityDto(
                        user.getId(),
                        project,
                        ActivityAction.DELETED,
                        description
                )
        );
    }

    @Override
    public List<TaskDto> findAllPagedAndFiltered(Pageable pageable, Long projectId) {
        Page<Task> t = taskRepository
                .findFilteredAndPaged(
                        projectId,
                        pageable);

        return new ArrayList<>(t.getContent().
                stream()
                .map(TaskMapper::mapTaskToTaskDto).toList());
    }

    @Override
    public List<TaskDto> getAllTasks(Long projectId) {
        return taskRepository.findAllByProject_IdOrderByOrderAsc(projectId).stream().map(TaskMapper::mapTaskToTaskDto).toList();
    }

    @Override
    public List<TaskDto> findUserTasks(Long projectId, Long userId) {
        return taskRepository.findTop3ByProjectIdAndAssignees_IdOrderByCreatedAtDesc(projectId, userId).stream().map(TaskMapper::mapTaskToTaskDto).toList();
    }


    private void syncMembers(Task task, List<SelectDto> members) {

        Map<Long, User> existingUsers =
                task.getAssignees().stream()
                        .collect(Collectors.toMap(
                                User::getId,
                                Function.identity()
                        ));

        List<User> updatedMembers = new ArrayList<>();

        for (SelectDto member : members) {
            User existing = existingUsers.get(member.getValue());

            if (existing != null) {
                updatedMembers.add(existing);
            } else {
                User newUser = userRepository.findById(member.getValue()).orElseThrow(EntityNotFoundException::new);
                updatedMembers.add(newUser);
            }
        }
        task.getAssignees().clear();
        task.getAssignees().addAll(updatedMembers);
    }

}
