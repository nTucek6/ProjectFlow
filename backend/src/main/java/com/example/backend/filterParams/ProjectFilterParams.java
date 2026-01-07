package com.example.backend.filterParams;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectFilterParams {

    private String title;
    private OffsetDateTime startDateTimeFrom;
    private OffsetDateTime startDateTimeTo;
    private Long userId;
}
