package com.example.backend.dto.projectMember;

import com.example.backend.enums.ProjectRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UpdateUserRoleDto {
    private ProjectRole role;
}
