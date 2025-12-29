package com.example.backend.mapper;

import com.example.backend.dto.projectMember.ProjectMemberDto;
import com.example.backend.model.table.ProjectMember;


public class ProjectMemberMapper {

    public static ProjectMemberDto mapProjectMemberToProjectMemberDto(ProjectMember member){
        ProjectMemberDto memberDto = new ProjectMemberDto();
        memberDto.setId(member.getId());
        memberDto.setFullName(member.getUser().getFullName());
        memberDto.setEmail(member.getUser().getEmail());
        memberDto.setRole(member.getRole());
        memberDto.setJoinedAt(member.getJoinedAt());
        memberDto.setRoleValue(member.getRole().name());
        return memberDto;
    }

}
