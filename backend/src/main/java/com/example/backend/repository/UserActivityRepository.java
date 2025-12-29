package com.example.backend.repository;

import com.example.backend.model.table.UserActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserActivityRepository extends JpaRepository<UserActivity, Long> {

    List<UserActivity> findTop3ByUser_IdOrderByCreatedAtDesc(Long userId);
}
