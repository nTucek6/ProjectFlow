package com.example.backend.controller;

import com.example.backend.dto.project.NewProjectDto;
import com.example.backend.dto.project.ProjectDto;
import com.example.backend.dto.SearchProjectDto;
import com.example.backend.dto.project.UpdateProjectDto;
import com.example.backend.dto.task.TaskDto;
import com.example.backend.filterParams.ProjectFilterParams;
import com.example.backend.service.ProjectService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/project")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDto> findById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(projectService.findById(id));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping
    public ResponseEntity<List<SearchProjectDto>> getAllEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "deadline") String sortBy,
            @RequestParam(defaultValue = "true") boolean ascending,
            @ModelAttribute ProjectFilterParams filterParams) {

        try {
            Sort.Direction direction = ascending ? Sort.Direction.ASC : Sort.Direction.DESC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

            List<SearchProjectDto> projects = projectService.findAllPagedAndFiltered(pageable, filterParams);
            return ResponseEntity.ok(projects);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<ProjectDto> createProject(@RequestBody NewProjectDto newProjectDto) {
        try {
            ProjectDto project = projectService.save(newProjectDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(project);

        } catch (EntityNotFoundException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ProjectDto> deleteProject(@PathVariable Long id) {
        try {
            projectService.delete(id);
            return ResponseEntity.noContent().build();

        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDto> updateProject(@PathVariable Long id, @RequestBody UpdateProjectDto updateProjectDto) {
        try {
            ProjectDto project = projectService.update(id, updateProjectDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(project);
        } catch (EntityNotFoundException e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

}
