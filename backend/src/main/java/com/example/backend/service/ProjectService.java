package com.example.backend.service;

import com.example.backend.dto.NewProjectDto;
import com.example.backend.dto.ProjectDto;
import com.example.backend.dto.SearchProjectDto;
import com.example.backend.filterParams.ProjectFilterParams;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProjectService {

    List<SearchProjectDto> findAllPagedAndFiltered(Pageable pageable, ProjectFilterParams filterParams);
    ProjectDto findById(Long id);
    ProjectDto save(NewProjectDto newProjectDto);
    void delete(Long id);


}
