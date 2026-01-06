package com.example.backend.dto.task;

import com.example.backend.dto.SelectDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateTaskDto {

    private Long projectId;
    private String title;
    private String description;
    private List<SelectDto> assignees;
    private Long projectMilestoneId;
}
