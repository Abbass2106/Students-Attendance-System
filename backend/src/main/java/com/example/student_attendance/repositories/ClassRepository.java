package com.example.student_attendance.repositories;

import com.example.student_attendance.models.Classes;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClassRepository extends JpaRepository<Classes, Long>{
    
}
