package com.example.backend.dto;

import com.example.backend.enums.UserRole;
import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String name;
    private String surname;
    private String email;
    private UserRole role;
    private String roleText;
}
