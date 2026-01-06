package com.example.backend.service.implementation;

import com.example.backend.dto.SelectDto;
import com.example.backend.dto.project.ProjectDto;
import com.example.backend.dto.projectMember.NewProjectMemberDto;
import com.example.backend.dto.projectMember.ProjectMemberDto;
import com.example.backend.dto.projectMember.UpdateLastAccessedDto;
import com.example.backend.dto.projectMember.UpdateUserRoleDto;
import com.example.backend.enums.ProjectRole;
import com.example.backend.mapper.ProjectMapper;
import com.example.backend.mapper.ProjectMemberMapper;
import com.example.backend.mapper.TaskMapper;
import com.example.backend.model.table.Project;
import com.example.backend.model.table.ProjectMember;
import com.example.backend.model.table.User;
import com.example.backend.repository.ProjectMemberRepository;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.ProjectMemberService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class ProjectMemberServiceImpl implements ProjectMemberService {

    private final ProjectMemberRepository projectMemberRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Override
    public List<ProjectMemberDto> getProjectMembers(Long projectId, String search) {
        List<ProjectRole> excludedRoles = List.of(ProjectRole.OWNER, ProjectRole.MENTOR);
        return projectMemberRepository.findAllByProject_IdAndRoleNotIn(projectId, excludedRoles, search).stream().map(ProjectMemberMapper::mapProjectMemberToProjectMemberDto).toList();
    }

    @Override
    public List<SelectDto> searchProjectMembers(Long projectId, String search) {
        List<ProjectRole> excludedRoles = List.of(ProjectRole.MENTOR);
        return projectMemberRepository.findAllByProject_IdAndSearch(projectId,excludedRoles,search).stream().map(ProjectMemberMapper::mapProjectMemberToSelectDto).toList();
    }


    @Override
    public void save(NewProjectMemberDto newMember) {

        Project project = projectRepository.findById(newMember.getProjectId()).orElseThrow(EntityNotFoundException::new);
        User user = userRepository.findById(newMember.getUserId()).orElseThrow(EntityNotFoundException::new);

        ProjectMember member = new ProjectMember();
        member.setProject(project);
        member.setUser(user);
        member.setRole(member.getRole());

        projectMemberRepository.save(member);
    }

    @Override
    public void update(Long id, UpdateUserRoleDto update) {
        ProjectMember toUpdate = projectMemberRepository.findById(id).orElseThrow(EntityNotFoundException::new);
        toUpdate.setRole(update.getRole());
        projectMemberRepository.save(toUpdate);
    }

    @Override
    public void delete(Long id) {
        projectMemberRepository.deleteById(id);
    }

    @Override
    public void updateLastAccessed(UpdateLastAccessedDto lastAccessedDto) {
        ProjectMember pm = projectMemberRepository.findByProject_IdAndUser_Id(lastAccessedDto.getProjectId(), lastAccessedDto.getUserId());
        pm.setLastAccessed(OffsetDateTime.now());
        projectMemberRepository.save(pm);
    }

    @Override
    public List<ProjectDto> recentUserProjects(Long userId) {

        List<ProjectMember> pm = projectMemberRepository.findTop3ByUser_IdOrderByLastAccessedDesc(userId);

        List<ProjectDto> projectsDto = new ArrayList<>();

        if (!pm.isEmpty()) {
            for (ProjectMember m : pm) {
                Project p = m.getProject();
                int progress = p.getProgress();
                int totalTasks = p.getTotalTasks();
                int members = p.getMembersCount();
                projectsDto.add(ProjectMapper.mapProjectToProjectDto(m.getProject(), progress, totalTasks, members));
            }
        }
        return projectsDto;
    }
}
