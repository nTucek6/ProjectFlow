package com.example.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Table(name = "milestone_templates")
@Immutable
public class MilestoneTemplates {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int sequence;
    private String color;
}
