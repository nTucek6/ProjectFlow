package com.example.backend.repository;

import com.example.backend.enums.ProjectStatus;
import com.example.backend.enums.TaskStatus;
import com.example.backend.model.table.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT e FROM Task e WHERE (:project_id IS NULL OR e.project.id = :project_id)")
    Page<Task> findFilteredAndPaged(
            @Param("project_id") Long project_id,
            Pageable pageable);

    List<Task> findTop3ByProjectIdAndAssignees_IdOrderByCreatedAtDesc(Long projectId, Long userId);

    List<Task> findAllByProject_IdOrderByOrderAsc(Long projectId);

    @Query("SELECT COALESCE(MAX(t.order), -1) FROM Task t " +
            "WHERE t.project.id = :projectId AND t.status = :status")
    Integer findMaxOrderByProjectIdAndStatus(Long projectId, TaskStatus status);

    List<Task> findAllByProject_IdAndStatusOrderByOrder(Long projectId, TaskStatus status);

    @Modifying
    @Query("UPDATE Task t SET t.order = t.order - 1 WHERE t.project.id = :projectId AND t.status = :status AND t.order > :deletedOrder")
    void decrementOrdersAfter(@Param("projectId") Long projectId, @Param("status") TaskStatus status, @Param("deletedOrder") int deletedOrder);


}
