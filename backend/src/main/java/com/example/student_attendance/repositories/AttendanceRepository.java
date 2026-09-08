package com.example.student_attendance.repositories;

import com.example.student_attendance.models.Attendance;
import com.example.student_attendance.models.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

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

    List<Attendance> findByStudentsId(Long studentId);

    List<Attendance> findByDate(java.time.LocalDate date);

    List<Attendance> findByClassesIdAndDate(Long classId, java.time.LocalDate date);

    boolean existsByStudentsIdAndDateAndClassesId(
            Long studentId,
            java.time.LocalDate date,
            Long classId
    );

    long countByStudentsId(Long studentId);

    long countByStudentsIdAndStatus(Long studentId, AttendanceStatus status);

    long countByClassesId(Long classId);

    long countByClassesIdAndStatus(Long classId, AttendanceStatus status);

    long countByEnrollmentIdAndStatus(
            Long enrollmentId,
            AttendanceStatus status
    );

    long countByEnrollmentId(Long enrollmentId);

    long countBySessionIdAndStatus(
            Long sessionId,
            AttendanceStatus status
    );
}