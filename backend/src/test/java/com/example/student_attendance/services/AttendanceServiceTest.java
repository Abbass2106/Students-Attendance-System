package com.example.student_attendance.services;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.student_attendance.models.AttendanceSession;
import com.example.student_attendance.models.AttendanceStatus;
import com.example.student_attendance.models.Enrollment;
import com.example.student_attendance.repositories.AttendanceRepository;
import com.example.student_attendance.repositories.AttendanceSessionRepository;
import com.example.student_attendance.repositories.EnrollmentRepository;

@ExtendWith(MockitoExtension.class)
class AttendanceServiceTest {

    @Mock
    private AttendanceRepository attendanceRepository;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Mock
    private AttendanceSessionRepository sessionRepository;

    @InjectMocks
    private AttendanceService attendanceService;

    @Test
    void createAttendance_rejects_duplicate_for_the_same_session_and_enrollment() {
        LocalDate date = LocalDate.of(2026, 9, 1);
        AttendanceSession session = new AttendanceSession();
        session.setId(10L);
        session.setDate(date);
        session.setClassId(1L);
        Enrollment enrollment = new Enrollment();
        enrollment.setId(20L);
        enrollment.setClassId(1L);

        when(sessionRepository.findById(10L)).thenReturn(Optional.of(session));
        when(enrollmentRepository.findById(20L)).thenReturn(Optional.of(enrollment));
        when(attendanceRepository.existsBySessionIdAndEnrollmentId(10L, 20L)).thenReturn(true);

        assertThrows(RuntimeException.class,
                () -> attendanceService.createAttendance(10L, 20L, AttendanceStatus.PRESENT));

        verify(attendanceRepository).existsBySessionIdAndEnrollmentId(eq(10L), eq(20L));
    }
}