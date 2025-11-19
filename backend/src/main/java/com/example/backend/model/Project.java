package com.example.backend.model;


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

    @ToString.Exclude
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<ProjectMember> members;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<Task> tasks;

    public User getOwner() {
        List<ProjectMember> memberList = new ArrayList<>(members); // safe copy
        return memberList.stream()
                .filter(pm -> pm.getRole() == ProjectRole.OWNER)
                .map(ProjectMember::getUser)
                .findFirst()
                .orElse(null);
    }

}
