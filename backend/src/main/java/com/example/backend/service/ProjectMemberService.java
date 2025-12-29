package com.example.backend.service;

import com.example.backend.dto.projectMember.NewProjectMemberDto;
import com.example.backend.dto.projectMember.ProjectMemberDto;
import com.example.backend.dto.projectMember.UpdateUserRoleDto;

import java.util.List;

public interface ProjectMemberService {

    List<ProjectMemberDto> getProjectMembers(Long projectId);

    void save(NewProjectMemberDto newMember);

    void update(Long id, UpdateUserRoleDto update);

    void delete(Long id);

}
