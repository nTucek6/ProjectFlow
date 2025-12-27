package com.example.backend.dto.project;

import com.example.backend.dto.customMilestone.CustomMilestonesDto;
import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class NewProjectDto {

    private String name;
    private Long ownerId;
    private List<Long> membersId;
    @Nullable
    private List<CustomMilestonesDto> customMilestones;
    private LocalDateTime deadline;
}


