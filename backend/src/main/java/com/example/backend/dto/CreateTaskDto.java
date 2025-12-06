package com.example.backend.dto;

import com.example.backend.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateTaskDto {

    private Long projectId;
    private String title;
    private String description;
}
