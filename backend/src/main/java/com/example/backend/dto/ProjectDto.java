package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectDto {

    private Long id;
    private String name;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;
    public LocalDateTime deadline;
    public int progress;
    public int totalTasks;
    public int membersCount;
}
