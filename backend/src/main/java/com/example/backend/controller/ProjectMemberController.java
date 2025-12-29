package com.example.backend.controller;

import com.example.backend.dto.project.ProjectDto;
import com.example.backend.dto.projectMember.NewProjectMemberDto;
import com.example.backend.dto.projectMember.ProjectMemberDto;
import com.example.backend.dto.projectMember.UpdateLastAccessedDto;
import com.example.backend.dto.projectMember.UpdateUserRoleDto;
import com.example.backend.service.ProjectMemberService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/project-members")
@AllArgsConstructor
@Slf4j
public class ProjectMemberController {

    private final ProjectMemberService projectMemberService;


    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ProjectMemberDto>> getProjectMembers(@PathVariable Long projectId, @RequestParam String search){
        try {
            return ResponseEntity.ok(projectMemberService.getProjectMembers(projectId, search));
        } catch (EntityNotFoundException e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> newProjectMember(@RequestBody NewProjectMemberDto newProjectMemberDto) {
        try {
            projectMemberService.save(newProjectMemberDto);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (EntityNotFoundException e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody UpdateUserRoleDto updateRole) {
        try {
            projectMemberService.update(id, updateRole);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (EntityNotFoundException e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProjectMember(@PathVariable Long id) {
        try {
            projectMemberService.delete(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (EntityNotFoundException e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/lastAccessed")
    public ResponseEntity<?> updateUserLastAccessed(@RequestBody UpdateLastAccessedDto update) {
        try {
            projectMemberService.updateLastAccessed(update);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (EntityNotFoundException e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProjectDto>> getRecentUserProjects(@PathVariable Long userId){
        try {
            List<ProjectDto> projects = projectMemberService.recentUserProjects(userId);
            return ResponseEntity.ok(projects);
        } catch (EntityNotFoundException e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }


}
