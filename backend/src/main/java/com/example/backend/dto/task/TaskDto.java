package com.example.backend.dto.task;

import com.example.backend.dto.SelectDto;
import com.example.backend.dto.UserDto;
import com.example.backend.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDto {

    private Long id;
    private String title;
    private String description;
    private OffsetDateTime createdAt;
    private TaskStatus status;
    private String statusText;
    private List<SelectDto> assignees;
    private Integer order;
}
