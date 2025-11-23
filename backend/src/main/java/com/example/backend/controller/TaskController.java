package com.example.backend.controller;

import com.example.backend.dto.SearchProjectDto;
import com.example.backend.dto.TaskDto;
import com.example.backend.model.Task;
import com.example.backend.service.TaskService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/task")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/project/{project_id}")
    public ResponseEntity<List<TaskDto>> getProjectTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "true") boolean ascending,
            @PathVariable Long project_id) {

        try {
            Sort.Direction direction = ascending ? Sort.Direction.ASC : Sort.Direction.DESC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

            List<TaskDto> tasks = taskService.findAllPagedAndFiltered(pageable, project_id);

            return ResponseEntity.ok(tasks);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/project/{user_id}")
    public ResponseEntity<List<TaskDto>> getUserTasks(){
        try{

            return ResponseEntity.ok(null);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

}
