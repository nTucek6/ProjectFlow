package com.example.backend.dto.userActivity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserActivityDto {
    private Long id;
    private Long userId;
    private String userFullName;
    private Long projectId;
    private String projectName;
    private String action;
    private String description;
    private OffsetDateTime createdAt;
}
