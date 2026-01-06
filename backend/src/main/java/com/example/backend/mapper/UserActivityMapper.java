package com.example.backend.mapper;

import com.example.backend.dto.userActivity.UserActivityDto;
import com.example.backend.model.table.UserActivity;

public class UserActivityMapper {

    public static UserActivityDto mapUserActivityToUserActivityDto(UserActivity activity){
        UserActivityDto dto = new UserActivityDto();
        dto.setId(activity.getId());
        dto.setUserId(activity.getUser().getId());
        dto.setCreatedAt(activity.getCreatedAt());
        dto.setAction(activity.getAction().getDescription());
        dto.setDescription(activity.getDescription());
        dto.setUserFullName(activity.getUser().getFullName());
        dto.setProjectName(activity.getProject().getName());
        return dto;
    }
}
