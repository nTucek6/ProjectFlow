package com.example.backend.repository;

import com.example.backend.enums.ProjectRole;
import com.example.backend.model.table.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {

    ProjectMember findByUser_Id(Long userId);

    List<ProjectMember> findAllByProject_IdAndRoleNotIn(Long projectId, List<ProjectRole> roles);

}
