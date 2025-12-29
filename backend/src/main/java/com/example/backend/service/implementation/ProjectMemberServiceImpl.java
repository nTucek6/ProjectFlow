package com.example.backend.service.implementation;

import com.example.backend.dto.projectMember.NewProjectMemberDto;
import com.example.backend.dto.projectMember.ProjectMemberDto;
import com.example.backend.dto.projectMember.UpdateUserRoleDto;
import com.example.backend.enums.ProjectRole;
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

import java.util.List;

@Service
@AllArgsConstructor
public class ProjectMemberServiceImpl implements ProjectMemberService {

    private final ProjectMemberRepository projectMemberRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Override
    public List<ProjectMemberDto> getProjectMembers(Long projectId) {
        List<ProjectRole> excludedRoles = List.of(ProjectRole.OWNER, ProjectRole.MENTOR);
        return projectMemberRepository.findAllByProject_IdAndRoleNotIn(projectId, excludedRoles).stream().map(ProjectMemberMapper::mapProjectMemberToProjectMemberDto).toList();
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
}
