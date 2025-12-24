package com.example.backend.service.implementation;

import com.example.backend.dto.NewProjectDto;
import com.example.backend.dto.ProjectDto;
import com.example.backend.dto.SearchProjectDto;
import com.example.backend.filterParams.ProjectFilterParams;
import com.example.backend.mapper.ProjectMapper;
import com.example.backend.model.table.*;
import com.example.backend.repository.MilestoneTemplatesRepository;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.ProjectService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Service
@AllArgsConstructor
public class ProjectServiceImpl implements ProjectService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final MilestoneTemplatesRepository milestoneTemplatesRepository;

    @Override
    @Transactional
    public List<SearchProjectDto> findAllPagedAndFiltered(Pageable pageable, ProjectFilterParams filterParams) {
        Page<Project> p = projectRepository
                .findFilteredAndPaged(
                        filterParams.getTitle(),
                        filterParams.getStartDateTimeFrom(),
                        filterParams.getStartDateTimeTo(),
                        pageable
                );

        return new ArrayList<>(p.getContent().
                stream()
                .map(project -> ProjectMapper.mapProjectToSearchProjectDto(project, project.getOwner())).toList());
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
        project.setDeadline(newProjectDto.getDeadline());
        project.setCreatedAt(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());

        List<ProjectMember> members = new ArrayList<>();

        if (newProjectDto.getMembersId() != null) {
            newProjectDto.getMembersId().forEach(memberId -> {
                User user = userRepository.findById(memberId).orElseThrow(EntityNotFoundException::new);
                members.add(new ProjectMember(project, user));
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
        return ProjectMapper.mapProjectToProjectDto(savedProject, 0, 0, membersCount);
    }

    @Override
    public void delete(Long id) {
        projectRepository.deleteById(id);
    }
}
