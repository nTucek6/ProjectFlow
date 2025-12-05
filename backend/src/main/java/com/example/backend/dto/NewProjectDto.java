package com.example.backend.dto;

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
    private List<Long> membersId;
    @Nullable
    private List<CustomMilestonesDto> customMilestones;
    private LocalDateTime deadline;
}


