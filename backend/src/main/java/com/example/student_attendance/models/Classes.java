package com.example.student_attendance.models;

import jakarta.persistence.*;

@Entity
@Table(name = "Classes")
public class Classes {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    private String name;

    public Classes() {
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }    
}
