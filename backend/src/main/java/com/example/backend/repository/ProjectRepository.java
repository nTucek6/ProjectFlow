package com.example.backend.repository;

import com.example.backend.model.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("SELECT e FROM Project e " +
            "WHERE (:title IS NULL OR e.name LIKE %:title%) " +
            "AND (:startDateTimeFrom IS NULL OR e.deadline >= :startDateTimeFrom) " +
            "AND (:startDateTimeTo IS NULL OR e.deadline <= :startDateTimeTo) ")
    Page<Project> findFilteredAndPaged(
            @Param("title") String title,
            @Param("startDateTimeFrom") LocalDateTime startDateTimeFrom,
            @Param("startDateTimeTo") LocalDateTime startDateTimeTo,
            Pageable pageable);

}
