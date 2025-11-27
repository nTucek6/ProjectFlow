package com.example.backend.service.implementation;

import com.example.backend.dto.CreateTaskDto;
import com.example.backend.dto.TaskDto;
import com.example.backend.enums.TaskStatus;
import com.example.backend.mapper.TaskMapper;
import com.example.backend.model.Project;
import com.example.backend.model.Task;
import com.example.backend.model.User;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.repository.TaskRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.TaskService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Override
    public TaskDto save(CreateTaskDto newTaskDto) {

        Project project = projectRepository.findById(newTaskDto.getProjectId()).orElseThrow(() -> new RuntimeException("Project not found"));

        Task task = new Task();
        task.setProject(project);
        task.setStatus(TaskStatus.TODO);
        task.setDescription(newTaskDto.getDescription());
        task.setCreatedAt(LocalDateTime.now());

       return TaskMapper.mapTaskToTaskDto(taskRepository.save(task));
    }

    @Override
    public TaskDto update(TaskDto taskDto) {
        Task taskToUpdate = taskRepository.findById(taskDto.getId()).orElseThrow(() -> new RuntimeException("Task not found"));

        taskToUpdate.setTitle(taskDto.getTitle());
        taskToUpdate.setDescription(taskDto.getDescription());
        taskToUpdate.setCreatedAt(LocalDateTime.now());
        taskToUpdate.setStatus(taskDto.getStatus());

        if(taskDto.getAssigneesId() != null) {
            for(Long id : taskDto.getAssigneesId()) {
                User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
                taskToUpdate.getAssignees().add(user);
            }
        }

       return TaskMapper.mapTaskToTaskDto(taskRepository.save(taskToUpdate));
    }

    @Override
    public void delete(Long id) {
        taskRepository.deleteById(id);
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
    public List<TaskDto> findUserTasks(Long projectId ,Long userId) {
        return taskRepository.findTop3ByProjectIdAndAssignees_IdOrderByCreatedAtDesc(projectId,userId).stream().map(TaskMapper::mapTaskToTaskDto).toList();
    }
}
