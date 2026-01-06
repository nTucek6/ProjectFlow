package com.example.backend.controller;

import com.example.backend.dto.task.CreateTaskDto;
import com.example.backend.dto.task.TaskDto;
import com.example.backend.service.TaskService;
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

@RestController
@RequestMapping("/api/task")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@Slf4j
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskDto> createTask(@RequestBody CreateTaskDto newTaskDto) {
        try {
            TaskDto task = taskService.save(newTaskDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(task);
        } catch (EntityNotFoundException e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDto> updateTask(@PathVariable Long id, @RequestBody TaskDto updateTaskDto) {
        try {
            TaskDto task = taskService.update(id, updateTaskDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(task);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/reorder")
    public ResponseEntity<Void> reorderTasks(@RequestBody List<TaskDto> tasks) {
        try {
            taskService.reorder(tasks);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<TaskDto> deleteTask(@PathVariable Long id) {
        try {
            taskService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<TaskDto>> getProjectTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "true") boolean ascending,
            @PathVariable Long projectId) {

        try {
            Sort.Direction direction = ascending ? Sort.Direction.ASC : Sort.Direction.DESC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

            List<TaskDto> tasks = taskService.findAllPagedAndFiltered(pageable, projectId);

            return ResponseEntity.ok(tasks);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/all/{projectId}")
    public ResponseEntity<List<TaskDto>> getAllTasks(@PathVariable Long projectId) {
        try {
            List<TaskDto> tasks = taskService.getAllTasks(projectId);
            return ResponseEntity.ok(tasks);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/project/{projectId}/{userId}")
    public ResponseEntity<List<TaskDto>> getUserTasks(@PathVariable Long projectId, @PathVariable Long userId) {
        try {
            List<TaskDto> userTasks = taskService.findUserTasks(projectId, userId);
            return ResponseEntity.ok(userTasks);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

}
