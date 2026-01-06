package com.example.backend.dto.userActivity;

import com.example.backend.enums.ActivityAction;
import com.example.backend.model.table.Project;
import com.example.backend.model.table.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CreateUserActivityDto {

    private Long userId;
    private Project project;
    private ActivityAction action;
    private String description;

}
