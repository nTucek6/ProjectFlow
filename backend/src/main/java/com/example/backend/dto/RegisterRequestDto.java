package com.example.backend.dto;

import lombok.Getter;

@Getter
public class RegisterRequestDto {
    private String email;
    private String password;
    private String name;
    private String surname;
}
