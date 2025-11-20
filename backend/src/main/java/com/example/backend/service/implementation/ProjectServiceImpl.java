package com.example.backend.service.implementation;

import com.example.backend.dto.ProjectDto;
import com.example.backend.dto.SearchProjectDto;
import com.example.backend.filterParams.ProjectFilterParams;
import com.example.backend.mapper.ProjectMapper;
import com.example.backend.mapper.UserMapper;
import com.example.backend.model.Project;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.service.ProjectService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
public class ProjectServiceImpl implements ProjectService {
    private final ProjectRepository projectRepository;

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


        log.info(p.toString());

        return new ArrayList<>(p.getContent().
                stream()
                .map(project ->ProjectMapper.mapProjectToSearchProjectDto(project, project.getOwner())).toList());
    }

    @Override
    public ProjectDto findById(Long id) {
        return ProjectMapper.mapProjectToProjectDto(projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Project not found")));
    }
}
