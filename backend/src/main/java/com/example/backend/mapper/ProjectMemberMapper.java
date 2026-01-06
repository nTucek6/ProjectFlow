package com.example.backend.mapper;

import com.example.backend.dto.SelectDto;
import com.example.backend.dto.projectMember.ProjectMemberDto;
import com.example.backend.model.table.ProjectMember;


public class ProjectMemberMapper {

    public static ProjectMemberDto mapProjectMemberToProjectMemberDto(ProjectMember member){
        ProjectMemberDto memberDto = new ProjectMemberDto();
        memberDto.setId(member.getId());
        memberDto.setUserId(member.getUser().getId());
        memberDto.setFullName(member.getUser().getFullName());
        memberDto.setEmail(member.getUser().getEmail());
        memberDto.setRole(member.getRole());
        memberDto.setJoinedAt(member.getJoinedAt());
        memberDto.setRoleValue(member.getRole().name());
        return memberDto;
    }

    public static SelectDto mapProjectMemberToSelectDto(ProjectMember member){
        SelectDto select = new SelectDto();
        select.setValue(member.getUser().getId());
        select.setLabel(member.getUser().getFullName());
        return select;
    }

}
