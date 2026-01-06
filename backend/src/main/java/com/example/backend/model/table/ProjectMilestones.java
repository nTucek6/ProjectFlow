package com.example.backend.model.table;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "project_milestones")
public class ProjectMilestones {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ToString.Exclude
    @ManyToOne(optional = false)
    @JoinColumn(name = "project_id")
    private Project project;

    private String name;
    private String description;
    private boolean completed;

    @ToString.Exclude
    @ManyToOne(optional = true)
    @JoinColumn(name = "template_id")
    private MilestoneTemplates template;

    private String color;
    private int sequence;

   /* @OneToOne(mappedBy = "projectMilestones")
    private Task task; */

    public ProjectMilestones(String name, String description, Project project, MilestoneTemplates template, String color, int sequence) {
        this.name = name;
        this.description = description;
        this.project = project;
        this.template = template;
        this.color = color;
        this.sequence = sequence;
    }

}
