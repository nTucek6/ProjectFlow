package com.example.backend.dto.auth;

import lombok.Getter;

@Getter
public class LoginRequestDTO {
    private String email;
    private String password;
}
