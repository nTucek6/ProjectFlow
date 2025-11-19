package com.example.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SearchProjectDto {

    private Long id;
    private String name;
    private String creatorName;
    private LocalDateTime createdAt;
    private LocalDateTime deadline;

}
