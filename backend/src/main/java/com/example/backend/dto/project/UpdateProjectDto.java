package com.example.backend.dto.project;

import com.example.backend.dto.customMilestone.UpdateCustomMilestoneDto;
import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UpdateProjectDto {

    private String name;
    private List<ProjectMemberDto> members;
    private List<UpdateCustomMilestoneDto> customMilestones;
    private LocalDateTime deadline;
    private LocalDateTime startDate;
    private LocalDateTime updatedAt;

}
