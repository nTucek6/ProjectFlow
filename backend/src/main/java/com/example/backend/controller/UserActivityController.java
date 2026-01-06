package com.example.backend.controller;

import com.example.backend.dto.userActivity.UserActivityDto;
import com.example.backend.service.UserActivityService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-activity")
@AllArgsConstructor
@Slf4j
public class UserActivityController {

    private final UserActivityService userActivityService;


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserActivityDto>> fetchTop3Activity(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(userActivityService.findRecent(userId));
        } catch (EntityNotFoundException e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<UserActivityDto>> fetchTop8ProjectActivity(@PathVariable Long projectId) {
        try {
            return ResponseEntity.ok(userActivityService.findProjectRecent(projectId));
        } catch (EntityNotFoundException e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }


   /* @PostMapping
    public ResponseEntity<UserActivityDto> logUserActivity(@RequestBody UserActivityDto userActivityDto){
        try {
            return ResponseEntity.ok(userActivityService.save(userActivityDto));
        } catch (EntityNotFoundException e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    } */


}
