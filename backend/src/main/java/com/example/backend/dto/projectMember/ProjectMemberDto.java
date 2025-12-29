package com.example.backend.dto.projectMember;

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
    private String fullName;
    private String email;
    private ProjectRole role;
    private String roleValue;
    private LocalDateTime joinedAt;
}
