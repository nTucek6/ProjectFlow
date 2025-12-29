package com.example.backend.dto.projectMember;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UpdateLastAccessedDto {
    private Long userId;
    private Long projectId;
}
