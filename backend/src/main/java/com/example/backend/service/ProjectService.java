package com.example.backend.service;

import com.example.backend.dto.project.DashboardSummaryDto;
import com.example.backend.dto.project.NewProjectDto;
import com.example.backend.dto.project.ProjectDto;
import com.example.backend.dto.SearchProjectDto;
import com.example.backend.dto.project.UpdateProjectDto;
import com.example.backend.filterParams.ProjectFilterParams;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProjectService {

    List<SearchProjectDto> findAllPagedAndFiltered(Pageable pageable, ProjectFilterParams filterParams);
    ProjectDto findById(Long id);
    ProjectDto save(NewProjectDto newProjectDto);
    ProjectDto update(Long projectId, UpdateProjectDto updateProject);
    void delete(Long id);
    DashboardSummaryDto getUserSummary(Long userId);


}
