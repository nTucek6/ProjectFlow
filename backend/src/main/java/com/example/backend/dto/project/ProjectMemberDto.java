package com.example.backend.dto.project;

import com.example.backend.enums.ProjectRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProjectMemberDto {

    private Long id;
    private Long projectId;
    private Long userId;
    private String userFullName;
    private ProjectRole role;
    private LocalDateTime joinedAt;

}
