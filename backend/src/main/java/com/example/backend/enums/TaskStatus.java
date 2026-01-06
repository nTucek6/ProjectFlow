package com.example.backend.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum TaskStatus {
    TODO("to do"),
    IN_PROGRESS("in progress"),
    DONE("done");

    private final String description;
    }
