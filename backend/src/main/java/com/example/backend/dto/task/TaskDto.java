package com.example.backend.dto.task;

import com.example.backend.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDto {

    private Long id;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private TaskStatus status;
    private String statusText;
    private List<Long> assigneesId;
    private Integer order;
}
