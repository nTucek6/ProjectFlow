package com.example.backend.dto.customMilestone;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UpdateCustomMilestoneDto {
    private Long id;
    private String name;
    private String description;
    private String color;
    private int sequence;
}
