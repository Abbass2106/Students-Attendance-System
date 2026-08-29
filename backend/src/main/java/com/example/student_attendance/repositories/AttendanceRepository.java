package com.example.student_attendance.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.student_attendance.models.Attendance;
import com.example.student_attendance.models.AttendanceStatus;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findStudentsById(Long studentId);

    List<Attendance> findByDate(LocalDate date);

    List<Attendance> findByStudentsClassesIdAndDate(Long classId, LocalDate date);

    boolean existsByStudentsIdAndDate(Long studentId, LocalDate date);

    long countByStudentsIdAndStatus(Long studentId, AttendanceStatus status);

    long countByStudentsId(Long studentId);

    long countByStudentsClassesId(Long classId);

    long countByStudentsClassesIdAndStatus(Long classId,AttendanceStatus status);

}
