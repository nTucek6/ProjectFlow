package com.example.backend.repository;

import com.example.backend.enums.ProjectRole;
import com.example.backend.model.table.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {

    ProjectMember findByUser_Id(Long userId);

    @Query("""
                SELECT e FROM ProjectMember e
                WHERE e.project.id = :projectId
                  AND e.role NOT IN :roles
                  AND (
                       :search IS NULL OR
                       LOWER(e.user.name) LIKE LOWER(CONCAT('%', :search, '%'))
                       OR LOWER(e.user.surname) LIKE LOWER(CONCAT('%', :search, '%'))
                  )
            """)
    List<ProjectMember> findAllByProject_IdAndRoleNotIn(@Param("projectId") Long projectId, @Param("roles") List<ProjectRole> roles, @Param("search") String search);

    List<ProjectMember> findAllByUser_Id(Long userId);

    long countByProject_IdAndUser_IdNot(Long projectId, Long userId);

    ProjectMember findByProject_IdAndUser_Id(Long projectId, Long userId);

    List<ProjectMember> findTop3ByUser_IdOrderByLastAccessedDesc(Long userId);

}
