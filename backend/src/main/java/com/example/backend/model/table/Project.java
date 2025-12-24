package com.example.backend.model.table;


import com.example.backend.enums.ProjectRole;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime deadline;
    private LocalDateTime updatedAt;

    @ToString.Exclude
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ProjectMember> members = new ArrayList<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Task> tasks = new ArrayList<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectMilestones> milestones = new ArrayList<>();

    public User getOwner() {
        List<ProjectMember> memberList = new ArrayList<>(members); // safe copy
        return memberList.stream()
                .filter(pm -> pm.getRole() == ProjectRole.OWNER)
                .map(ProjectMember::getUser)
                .findFirst()
                .orElse(null);
    }

}
