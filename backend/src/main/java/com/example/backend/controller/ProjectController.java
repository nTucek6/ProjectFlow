package com.example.backend.controller;

import com.example.backend.dto.SearchProjectDto;
import com.example.backend.filterParams.ProjectFilterParams;
import com.example.backend.service.ProjectService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/project")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<SearchProjectDto>> getAllEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "deadline") String sortBy,
            @RequestParam(defaultValue = "true") boolean ascending,
            @ModelAttribute ProjectFilterParams filterParams) {

        Sort.Direction direction = ascending ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        List<SearchProjectDto> projects = projectService.findAllPagedAndFiltered(pageable, filterParams);
        return ResponseEntity.ok(projects);
    }

}
