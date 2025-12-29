package com.example.backend.model.table;


import com.example.backend.enums.ProjectRole;
import com.example.backend.enums.ProjectStatus;
import jakarta.annotation.Nullable;
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
    private LocalDateTime startDate;
    private LocalDateTime deadline;
    private LocalDateTime updatedAt;
    @Nullable
    private LocalDateTime completedAt;
    private ProjectStatus status;


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


    public int getProgress() {
        long done = tasks.stream().filter(Task::isDone).count();
        return tasks.isEmpty() ? 0 : (int) Math.round((done * 100.0) / tasks.size());
    }

    public int getTotalTasks() {
        return tasks.size();
    }

    public int getMembersCount() {
        return members.size();
    }


}
