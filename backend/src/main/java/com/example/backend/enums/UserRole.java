package com.example.backend.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum UserRole {
    ADMIN("Admin"),
    USER("User"),
    MENTOR("Mentor");

    private final String description;

}
