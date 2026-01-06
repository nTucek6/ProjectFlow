package com.example.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Data
public class SearchProjectDto {

    private Long id;
    private String name;
    private String creatorName;
    private OffsetDateTime createdAt;
    private OffsetDateTime deadline;
}
