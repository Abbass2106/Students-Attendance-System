package com.example.student_attendance.repositories;

import com.example.student_attendance.models.Students;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface StudentRepository extends JpaRepository<Students, Long> {

    Optional<Students> findByStudentNumber(String studentNumber);

    boolean existsByStudentNumber(String studentNumber);

    Optional<Students> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Students> findByClassesId(Long classId);

    long countByClassesId(Long classId);
}