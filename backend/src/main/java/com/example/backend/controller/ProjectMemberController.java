package com.example.backend.controller;

import com.example.backend.dto.projectMember.NewProjectMemberDto;
import com.example.backend.dto.projectMember.ProjectMemberDto;
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
    public ResponseEntity<List<ProjectMemberDto>> getProjectMembers(@PathVariable Long projectId){
        try {
            return ResponseEntity.ok(projectMemberService.getProjectMembers(projectId));
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

}
