package com.example.backend.repository;

import com.example.backend.model.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT e FROM Task e WHERE (:project_id IS NULL OR e.project.id = :project_id)")
    Page<Task> findFilteredAndPaged(
            @Param("project_id") Long project_id,
            Pageable pageable);

    List<Task> findTop3ByProjectIdAndAssignees_IdOrderByCreatedAtDesc(Long projectId,Long userId);

    List<Task> findAllByProject_IdOrderByOrderAsc(Long projectId);

    //List<Task> findByProject(Long project_id);

}
