package com.example.backend.service;

import com.example.backend.dto.userActivity.UserActivityDto;
import com.example.backend.model.table.UserActivity;

import java.util.List;

public interface UserActivityService {

    UserActivityDto save(UserActivityDto save);

    List<UserActivityDto> findRecent(Long userId);

}
