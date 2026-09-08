package com.example.student_attendance.repositories;

import com.example.student_attendance.models.Program;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProgramRepository extends JpaRepository<Program, Long> {

    Optional<Program> findByCode(String code);

    boolean existsByCode(String code);
}