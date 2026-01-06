package com.example.backend.service.implementation;

import com.example.backend.dto.userActivity.UserActivityDto;
import com.example.backend.mapper.UserActivityMapper;
import com.example.backend.model.table.Project;
import com.example.backend.model.table.User;
import com.example.backend.model.table.UserActivity;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.repository.UserActivityRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.UserActivityService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class UserActivityServiceImpl implements UserActivityService {

    private final UserActivityRepository userActivityRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    @Override
    public UserActivityDto save(UserActivityDto save) {
        UserActivity a = new UserActivity();

        User user = userRepository.findById(save.getUserId()).orElseThrow(EntityNotFoundException::new);
        Project project = projectRepository.findById(save.getProjectId()).orElseThrow(EntityNotFoundException::new);

        a.setUser(user);
        a.setProject(project);
        a.setAction(save.getAction());
        a.setDescription(save.getDescription());
        a.setCreatedAt(OffsetDateTime.now());
        return UserActivityMapper.mapUserActivityToUserActivityDto(userActivityRepository.save(a));
    }

    @Override
    public List<UserActivityDto> findRecent(Long userId) {
        return userActivityRepository.findTop3ByUser_IdOrderByCreatedAtDesc(userId).stream().map(UserActivityMapper::mapUserActivityToUserActivityDto).toList();
    }
}
