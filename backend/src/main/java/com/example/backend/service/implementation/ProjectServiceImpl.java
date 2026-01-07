package com.example.backend.service.implementation;

import com.example.backend.dto.customMilestone.CustomMilestonesDto;
import com.example.backend.dto.customMilestone.UpdateCustomMilestoneDto;
import com.example.backend.dto.project.*;
import com.example.backend.dto.SearchProjectDto;
import com.example.backend.dto.userActivity.CreateUserActivityDto;
import com.example.backend.enums.ActivityAction;
import com.example.backend.enums.ProjectRole;
import com.example.backend.enums.ProjectStatus;
import com.example.backend.filterParams.ProjectFilterParams;
import com.example.backend.mapper.ProjectMapper;
import com.example.backend.model.table.*;
import com.example.backend.repository.MilestoneTemplatesRepository;
import com.example.backend.repository.ProjectMemberRepository;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.ProjectService;
import com.example.backend.service.auth.CustomUserDetails;
import com.example.backend.utils.ProjectUtil;
import com.example.backend.utils.SecurityUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@AllArgsConstructor
public class ProjectServiceImpl implements ProjectService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final MilestoneTemplatesRepository milestoneTemplatesRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public List<SearchProjectDto> findAllPagedAndFiltered(Pageable pageable, ProjectFilterParams filterParams) {

        //Long userId = SecurityUtils.getCurrentUserId();

        Page<Project> p = projectRepository
                .findFilteredAndPaged(
                        filterParams.getTitle(),
                        filterParams.getStartDateTimeFrom(),
                        filterParams.getStartDateTimeTo(),
                        filterParams.getUserId(),
                        pageable
                );

        return new ArrayList<>(p.getContent().
                stream()
                .map(project -> ProjectMapper.mapProjectToSearchProjectDto(project, project.getOwner(), p.getTotalElements())).toList());
    }

    @Override
    public ProjectDto findById(Long id) {
        Project project = projectRepository.findById(id).orElseThrow(EntityNotFoundException::new);
        long done = project.getTasks().stream().filter(Task::isDone).count();
        int progress = (project.getTasks().isEmpty()) ? 0 : (int) Math.round((done * 100.0) / project.getTasks().size());
        int totalTasks = project.getTasks().size();
        int membersCount = project.getMembers().size();
        return ProjectMapper.mapProjectToProjectDto(project, progress, totalTasks, membersCount);
    }

    @Transactional
    @Override
    public ProjectDto save(NewProjectDto newProjectDto) {
        Project project = new Project();
        project.setName(newProjectDto.getName());
        project.setDescription(newProjectDto.getDescription());
        project.setDeadline(newProjectDto.getDeadline());
        project.setCreatedAt(OffsetDateTime.now());
        project.setUpdatedAt(OffsetDateTime.now());
        project.setStatus(ProjectStatus.BACKLOG);

        List<ProjectMember> members = new ArrayList<>();

        User owner = userRepository.findById(newProjectDto.getOwnerId()).orElseThrow(EntityNotFoundException::new);
        members.add(ProjectMember.createOwner(project, owner));


        if (newProjectDto.getMembersId() != null) {
            newProjectDto.getMembersId().forEach(memberId -> {
                User user = userRepository.findById(memberId).orElseThrow(EntityNotFoundException::new);
                //members.add(new ProjectMember(project, user, ProjectRole.MEMBER));
                members.add(ProjectMember.createMember(project, user));
            });
        }
        project.setMembers(members);

        List<MilestoneTemplates> milestones = (List<MilestoneTemplates>) milestoneTemplatesRepository.findAll();

        List<ProjectMilestones> projectMilestones = new ArrayList<>();

        milestones.forEach(m -> {
            projectMilestones.add(new ProjectMilestones(m.getName(), "", project, m, m.getColor(), m.getSequence()));
        });

        AtomicInteger sequence = new AtomicInteger(projectMilestones.getLast().getSequence());
        if (newProjectDto.getCustomMilestones() != null) {
            newProjectDto.getCustomMilestones().forEach(c -> {
                sequence.set(sequence.get() + 1);
                projectMilestones.add(new ProjectMilestones(c.getName(), c.getDescription(), project, null, c.getColor(), sequence.get()));
            });
        }

        project.setMilestones(projectMilestones);

        Project savedProject = projectRepository.save(project);
        int membersCount = savedProject.getMembers().size();
        String description = owner.getFullName() + " created new project: " + savedProject.getName();
        eventPublisher.publishEvent(
                new CreateUserActivityDto(
                        owner.getId(),
                        savedProject,
                        ActivityAction.CREATED,
                        description
                )
        );
        return ProjectMapper.mapProjectToProjectDto(savedProject, 0, 0, membersCount);
    }

    @Override
    @Transactional
    public ProjectDto update(Long projectId, UpdateProjectDto updateProject) {
        Project proToUpdate = projectRepository.findById(projectId).orElseThrow(EntityNotFoundException::new);

        proToUpdate.setName(updateProject.getName());
        proToUpdate.setDeadline(updateProject.getDeadline());
        proToUpdate.setDescription(updateProject.getDescription());

        if (updateProject.getStartDate() != null) {
            proToUpdate.setStartDate(updateProject.getStartDate());
        }
        if (updateProject.getUpdatedAt() != null) {
            proToUpdate.setUpdatedAt(updateProject.getUpdatedAt());
        }
        if (updateProject.getMembers() != null && !updateProject.getMembers().isEmpty()) {
            syncMembers(proToUpdate, updateProject.getMembers());
        }
        if (updateProject.getCustomMilestones() != null && !updateProject.getCustomMilestones().isEmpty()) {
            syncCustomMilestones(proToUpdate, updateProject.getCustomMilestones());
        }

        Project updatedProject = projectRepository.save(proToUpdate);
        CustomUserDetails user = SecurityUtils.getPrincipal();
        String description = user.getFullName() + " updated project: " + updatedProject.getName();
        eventPublisher.publishEvent(
                new CreateUserActivityDto(
                        user.getId(),
                        updatedProject,
                        ActivityAction.UPDATED,
                        description
                )
        );

        return ProjectMapper.mapProjectToProjectDto(updatedProject, updatedProject.getProgress(), updatedProject.getTotalTasks(), updatedProject.getMembersCount());
        //return ProjectMapper.mapProjectToProjectDto(proToUpdate, proToUpdate.getProgress(), proToUpdate.getTotalTasks(), proToUpdate.getMembersCount());
    }

    @Override
    public void delete(Long id) {
        projectRepository.deleteById(id);
    }

    @Override
    public DashboardSummaryDto getUserSummary(Long userId) {

        List<ProjectMember> projects = projectMemberRepository.findAllByUser_Id(userId);

        int activeProjects = 0;
        int pendingProjects = 0;
        int completedProjects = 0;
        int teamMembers = 0;

        for (ProjectMember m : projects) {
            ProjectStatus ps = m.getProject().getStatus();
            teamMembers += (int) projectMemberRepository.countByProject_IdAndUser_IdNot(m.getProject().getId(), userId);
            if (ps == ProjectStatus.IN_PROGRESS || ps == ProjectStatus.IN_REVIEW) {
                activeProjects++;
            } else if (ps == ProjectStatus.BACKLOG || ps == ProjectStatus.PLANNED) {
                pendingProjects++;
            } else if (ps == ProjectStatus.DONE)
                completedProjects++;
        }

        return new DashboardSummaryDto(activeProjects, pendingProjects, completedProjects, teamMembers);
    }


    private void syncCustomMilestones(Project project, List<UpdateCustomMilestoneDto> customMilestones) {

        Map<Long, ProjectMilestones> existingMilestones =
                project.getMilestones().stream()
                        .collect(Collectors.toMap(
                                ProjectMilestones::getId,
                                Function.identity()
                        ));

        List<ProjectMilestones> updated = new ArrayList<>();

        for (ProjectMilestones m : project.getMilestones()) {
            if (m.getTemplate() != null) {
                updated.add(m);
            }
        }

        int templateMaxSequence = updated.stream()
                .mapToInt(ProjectMilestones::getSequence)
                .max()
                .orElse(0);

        for (UpdateCustomMilestoneDto dto : customMilestones) {
            ProjectMilestones existing = existingMilestones.get(dto.getId());
            if (existing != null) {
                existing.setName(dto.getName());
                existing.setDescription(dto.getDescription());
                existing.setColor(dto.getColor());
                existing.setSequence(templateMaxSequence + dto.getSequence());
                updated.add(existing);
            } else {
                ProjectMilestones m = new ProjectMilestones(
                        dto.getName(),
                        dto.getDescription(),
                        project,
                        null,
                        dto.getColor(),
                        (templateMaxSequence + dto.getSequence())
                );
                updated.add(m);
            }
        }
        project.getMilestones().clear();
        project.getMilestones().addAll(updated);
    }

    private void syncMembers(Project project, List<ProjectMemberDto> members) {

        Map<Long, ProjectMember> existingUsers =
                project.getMembers().stream()
                        .collect(Collectors.toMap(
                                pm -> pm.getUser().getId(),
                                Function.identity()
                        ));

        List<ProjectMember> updatedMembers = new ArrayList<>();

        for (ProjectMemberDto member : members) {
            ProjectMember existing = existingUsers.get(member.getUserId());

            if (existing != null) {
                existing.setRole(member.getRole());
                updatedMembers.add(existing);
            } else {
                User newUser = userRepository.findById(member.getUserId()).orElseThrow(EntityNotFoundException::new);
                ProjectMember pm = new ProjectMember(project, newUser, member.getRole());
                updatedMembers.add(pm);
            }
        }
        project.getMembers().clear();
        project.getMembers().addAll(updatedMembers);
    }


}
