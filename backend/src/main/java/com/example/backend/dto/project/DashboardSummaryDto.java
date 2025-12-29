package com.example.backend.dto.project;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DashboardSummaryDto {
    private int activeProjects;
    private int pendingProjects;
    private int completedProjects;
    private int teamMembers;
}
