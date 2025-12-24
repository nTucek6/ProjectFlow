package com.example.backend.service;

import com.example.backend.dto.RegisterRequestDto;
import com.example.backend.dto.SelectDto;
import com.example.backend.dto.UserDto;
import com.example.backend.model.User;

import java.util.List;

public interface UserService {
    UserDto findById(Long id);

    User findByEmail(String email);

    List<SelectDto> findBySearch(String search);

    UserDto registerUser(RegisterRequestDto registerRequest);

    UserDto save (User user);

    boolean existsByEmail(String email);

}
