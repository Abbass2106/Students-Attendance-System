package com.example.student_attendance.repositories;

import com.example.student_attendance.models.Classes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClassesRepository extends JpaRepository<Classes, Long> {

    Optional<Classes> findByCode(String code);

    boolean existsByCode(String code);

    boolean existsByCodeAndIdNot(String code, Long id);

    long countByCourseId(Long courseId);

    // Used to scope a TEACHER's view to only the classes assigned to them.
    List<Classes> findByLecturerId(Long lecturerId);
}