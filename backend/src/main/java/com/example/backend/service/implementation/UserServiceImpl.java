package com.example.backend.service.implementation;

import com.example.backend.dto.auth.RegisterRequestDto;
import com.example.backend.dto.SelectDto;
import com.example.backend.dto.UserDto;
import com.example.backend.enums.UserRole;
import com.example.backend.mapper.UserMapper;
import com.example.backend.model.table.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDto findById(Long id) {
        return UserMapper.mapUserToUserDto(userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found")));
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public List<SelectDto> findBySearch(String search) {
        return userRepository.searchUsers(search).
                stream()
                .map(UserMapper::mapUserToSelectDto).toList();
    }

    @Override
    public User registerUser(RegisterRequestDto registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email already in use!");
        }

        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setName(registerRequest.getName());
        user.setSurname(registerRequest.getSurname());
        user.setEnabled(Boolean.FALSE);
        user.setRole(UserRole.USER);

        return userRepository.save(user);
    }

    @Override
    public UserDto save(User user) {
        return UserMapper.mapUserToUserDto(userRepository.save(user));
    }

    @Override
    public boolean existsByEmail(String email) {
        return false;
    }
}
