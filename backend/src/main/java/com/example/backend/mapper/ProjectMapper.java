package com.example.backend.mapper;

import com.example.backend.dto.project.ProjectDto;
import com.example.backend.dto.SearchProjectDto;
import com.example.backend.model.table.Project;
import com.example.backend.model.table.User;

public class ProjectMapper {

    public static SearchProjectDto mapProjectToSearchProjectDto(Project project, User owner, Long length){
        SearchProjectDto projectDto = new SearchProjectDto();
        projectDto.setId(project.getId());
        projectDto.setName(project.getName());
        projectDto.setCreatorName(owner.getFullName());
        projectDto.setCreatedAt(project.getCreatedAt());
        projectDto.setDeadline(project.getDeadline());
        projectDto.setLength(length);
        return projectDto;
    }

    public static ProjectDto mapProjectToProjectDto(Project project, int progress, int totalTasks,int membersCount){
        ProjectDto projectDto = new ProjectDto();
        projectDto.setId(project.getId());
        projectDto.setName(project.getName());
        projectDto.setDescription(project.getDescription());
        projectDto.setCreatedAt(project.getCreatedAt());
        projectDto.setUpdatedAt(project.getUpdatedAt());
        projectDto.setStartDate(project.getStartDate());
        projectDto.setDeadline(project.getDeadline());
        projectDto.setProgress(progress);
        projectDto.setTotalTasks(totalTasks);
        projectDto.setMembersCount(membersCount);
        return  projectDto;
    }

}
