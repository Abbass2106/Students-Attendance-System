package com.example.student_attendance.repositories;
import com.example.student_attendance.models.Students;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface StudentRepository extends JpaRepository <Students, Long> {

    List<Students> findByClassesId(Long classId);
}
