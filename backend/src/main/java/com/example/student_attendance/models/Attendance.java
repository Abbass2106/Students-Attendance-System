package com.example.student_attendance.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

import jakarta.persistence.*;

@Entity
@Table(name = "Attendance")
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    AttendanceStatus status;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Students students;


    public Attendance() {
    }


    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public LocalDate getDate() {
        return date;
    }


    public void setDate(LocalDate date) {
        this.date = date;
    }


    public AttendanceStatus getStatus() {
        return status;
    }


    public void setStatus(AttendanceStatus status) {
        this.status = status;
    }


    public Students getStudents(){
        return students;
    }

    public void setStudents(Students students){
        this.students=students;
    }
    
}
