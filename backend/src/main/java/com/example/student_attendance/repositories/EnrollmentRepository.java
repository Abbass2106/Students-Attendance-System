package com.example.student_attendance.repositories;

import com.example.student_attendance.models.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    List<Enrollment> findByStudentId(Long studentId);

    List<Enrollment> findByClassId(Long classId);

    Optional<Enrollment> findByStudentIdAndClassId(
            Long studentId,
            Long classId
    );

    boolean existsByStudentIdAndClassId(
            Long studentId,
            Long classId
    );

    long countByClassId(Long classId);
}