package com.example.backend.repository;

import com.example.backend.model.ProjectMilestones;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectMilestonesRepository extends JpaRepository<ProjectMilestones, Long> {
}
