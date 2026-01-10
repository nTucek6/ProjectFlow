package com.example.backend.model.table;


import com.example.backend.enums.ProjectRole;
import com.example.backend.enums.ProjectStatus;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
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
    @Lob
    private String description;
    private OffsetDateTime createdAt;
    @Nullable
    private OffsetDateTime startDate;
    private OffsetDateTime deadline;
    private OffsetDateTime updatedAt;
    @Nullable
    private OffsetDateTime completedAt;
    private ProjectStatus status;


    @ToString.Exclude
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ProjectMember> members = new ArrayList<>();

    @ToString.Exclude
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.EAGER,  orphanRemoval = true)
    private List<Task> tasks = new ArrayList<>();

    @ToString.Exclude
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectMilestones> milestones = new ArrayList<>();

    @ToString.Exclude
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatRoom> chats = new ArrayList<>();

    @ToString.Exclude
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserActivity> userActivity = new ArrayList<>();

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
