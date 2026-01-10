package com.example.backend.mapper;

import com.example.backend.dto.SelectDto;
import com.example.backend.dto.UserDto;
import com.example.backend.model.table.User;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class UserMapper {

    public static UserDto mapUserToUserDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setName(user.getName());
        userDto.setSurname(user.getSurname());
        userDto.setEmail(user.getEmail());
        userDto.setRole(user.getRole());
        userDto.setRoleText(user.getRole().getDescription());
        return userDto;
    }

    public static SelectDto mapUserToSelectDto(User user) {
        SelectDto selectDto = new SelectDto();
        selectDto.setValue(user.getId());
        selectDto.setLabel(user.getFullName());
        return selectDto;
    }

}
