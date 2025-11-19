package com.example.backend.filterParams;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectFilterParams {

    private String title;
    private LocalDateTime startDateTimeFrom;
    private LocalDateTime startDateTimeTo;
}
