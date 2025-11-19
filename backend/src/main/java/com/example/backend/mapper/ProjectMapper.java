package com.example.backend.mapper;

import com.example.backend.dto.SearchProjectDto;
import com.example.backend.model.Project;
import com.example.backend.model.User;

public class ProjectMapper {

    public static SearchProjectDto mapProjectToSearchProjectDto(Project project, User owner){
        SearchProjectDto projectDto = new SearchProjectDto();
        projectDto.setId(project.getId());
        projectDto.setName(project.getName());
        projectDto.setCreatorName(owner.getName()+" "+owner.getSurname());
        projectDto.setCreatedAt(project.getCreatedAt());
        projectDto.setDeadline(project.getDeadline());
        return projectDto;
    }
}
