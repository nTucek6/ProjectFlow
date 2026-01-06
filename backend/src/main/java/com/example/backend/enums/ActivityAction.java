package com.example.backend.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@AllArgsConstructor
@Getter
public enum ActivityAction {
    CREATED("created"),
    UPDATED("updated"),
    DELETED("deleted"),
    STATUS_CHANGED("status changed"),
    COMMENTED("commented");

    private final String description;
}
