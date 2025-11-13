package com.example.backend.service;

import com.example.backend.dto.UserDto;

public interface UserService {
    public UserDto findById(Long id);
}
