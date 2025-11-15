package com.example.backend.service;

import com.example.backend.dto.UserDto;
import com.example.backend.model.User;

public interface UserService {
    public UserDto findById(Long id);
    public User findByEmail(String email);

}
