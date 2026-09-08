package com.example.student_attendance.repositories;

import com.example.student_attendance.models.Attendance;
import com.example.student_attendance.models.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AttendanceRepository
        extends JpaRepository<Attendance, Long> {

    List<Attendance> findBySessionId(Long sessionId);

    List<Attendance> findByEnrollmentId(Long enrollmentId);

    Optional<Attendance> findBySessionIdAndEnrollmentId(
            Long sessionId,
            Long enrollmentId
    );

    boolean existsBySessionIdAndEnrollmentId(
            Long sessionId,
            Long enrollmentId
    );

    long countByEnrollmentId(Long enrollmentId);

    long countByEnrollmentIdAndStatus(
            Long enrollmentId,
            AttendanceStatus status
    );

    long countBySessionIdAndStatus(
            Long sessionId,
            AttendanceStatus status
    );
}