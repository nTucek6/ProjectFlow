package com.example.backend.listener;

import com.example.backend.dto.userActivity.CreateUserActivityDto;
import com.example.backend.dto.userActivity.UserActivityDto;
import com.example.backend.model.table.User;
import com.example.backend.model.table.UserActivity;
import com.example.backend.repository.UserActivityRepository;
import com.example.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;

@Component
@AllArgsConstructor
public class UserActivityListener {

    private final UserActivityRepository userActivityRepository;
    private final UserRepository userRepository;

    @Async
    @EventListener
    public void handle(CreateUserActivityDto event) {
        User user = userRepository.findById(event.getUserId()).orElseThrow(()-> new EntityNotFoundException("User not found"));

        UserActivity activity = new UserActivity();
        activity.setUser(user);
        activity.setProject(event.getProject());
        activity.setAction(event.getAction());
        activity.setDescription(event.getDescription());
        activity.setCreatedAt(OffsetDateTime.now());
        userActivityRepository.save(activity);
    }
}
