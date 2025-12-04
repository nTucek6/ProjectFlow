package com.example.backend.service;

import com.example.backend.dto.SelectDto;
import com.example.backend.dto.UserDto;
import com.example.backend.model.User;

import java.util.List;

public interface UserService {
    public UserDto findById(Long id);
    public User findByEmail(String email);
    public List<SelectDto> findBySearch(String search);


}
