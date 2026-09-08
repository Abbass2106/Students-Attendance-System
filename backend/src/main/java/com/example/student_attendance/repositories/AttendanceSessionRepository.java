package com.example.student_attendance.repositories;

import com.example.student_attendance.models.AttendanceSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceSessionRepository
        extends JpaRepository<AttendanceSession, Long> {

    List<AttendanceSession> findByClassId(Long classId);

    List<AttendanceSession> findByDate(LocalDate date);

    List<AttendanceSession> findByClassIdAndDate(
            Long classId,
            LocalDate date
    );
}