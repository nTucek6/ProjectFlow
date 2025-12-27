package com.example.backend.repository;

import com.example.backend.model.table.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {

    ProjectMember findByUser_Id(Long userId);

}
