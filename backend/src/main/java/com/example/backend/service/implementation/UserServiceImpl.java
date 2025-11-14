package com.example.backend.service.implementation;

import com.example.backend.dto.UserDto;
import com.example.backend.mapper.UserMapper;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserDto findById(Long id) {
        return UserMapper.mapUserToUserDto(userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found")));
    }
}
