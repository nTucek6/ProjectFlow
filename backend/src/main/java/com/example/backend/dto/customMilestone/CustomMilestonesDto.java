package com.example.backend.dto.customMilestone;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class CustomMilestonesDto {
    private String name;
    private String description;
    private String color;
}
