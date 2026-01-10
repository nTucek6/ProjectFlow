package com.example.backend.dto.project;

import com.example.backend.enums.ProjectRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectDto {

    private Long id;
    private String name;
    private String description;
    public OffsetDateTime createdAt;
    public OffsetDateTime updatedAt;
    public OffsetDateTime startDate;
    public OffsetDateTime deadline;
    public int progress;
    public int totalTasks;
    public int membersCount;
    private ProjectRole role;
}
