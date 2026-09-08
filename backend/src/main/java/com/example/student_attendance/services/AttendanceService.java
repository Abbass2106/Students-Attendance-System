package com.example.student_attendance.services;

import com.example.student_attendance.models.Attendance;
import com.example.student_attendance.models.AttendanceStatus;
import com.example.student_attendance.repositories.AttendanceRepository;
import com.example.student_attendance.repositories.EnrollmentRepository;
import com.example.student_attendance.repositories.AttendanceSessionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AttendanceSessionRepository sessionRepository;

    public AttendanceService(
            AttendanceRepository attendanceRepository,
            EnrollmentRepository enrollmentRepository,
            AttendanceSessionRepository sessionRepository
    ) {
        this.attendanceRepository = attendanceRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.sessionRepository = sessionRepository;
    }

    public Attendance createAttendance(
            Long sessionId,
            Long enrollmentId,
            AttendanceStatus status
    ) {

        var session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Attendance session not found"));

        enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        boolean exists =
                attendanceRepository.existsBySessionIdAndEnrollmentId(
                        sessionId,
                        enrollmentId
                );

        if (exists) {
            throw new RuntimeException(
                    "Attendance already exists for this student"
            );
        }

        Attendance attendance = new Attendance();

        attendance.setSessionId(sessionId);
        attendance.setEnrollmentId(enrollmentId);
        attendance.setDate(session.getDate());
        attendance.setStatus(status);

        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getAttendanceBySession(Long sessionId) {

        if (!sessionRepository.existsById(sessionId)) {
            throw new RuntimeException("Attendance session not found");
        }

        return attendanceRepository.findBySessionId(sessionId);
    }

    public List<Attendance> getAttendanceByEnrollment(
            Long enrollmentId
    ) {

        if (!enrollmentRepository.existsById(enrollmentId)) {
            throw new RuntimeException("Enrollment not found");
        }

        return attendanceRepository.findByEnrollmentId(enrollmentId);
    }

    public Attendance getAttendance(
            Long sessionId,
            Long enrollmentId
    ) {

        return attendanceRepository
                .findBySessionIdAndEnrollmentId(
                        sessionId,
                        enrollmentId
                )
                .orElseThrow(() ->
                        new RuntimeException("Attendance not found"));
    }

    public Attendance updateAttendance(
            Long sessionId,
            Long enrollmentId,
            AttendanceStatus status
    ) {

        Attendance attendance =
                getAttendance(sessionId, enrollmentId);

        attendance.setStatus(status);

        return attendanceRepository.save(attendance);
    }

    public void deleteAttendance(
            Long sessionId,
            Long enrollmentId
    ) {

        Attendance attendance =
                getAttendance(sessionId, enrollmentId);

        attendanceRepository.delete(attendance);
    }

    public long countAttendanceByStatus(
            Long enrollmentId,
            AttendanceStatus status
    ) {

        return attendanceRepository
                .countByEnrollmentIdAndStatus(
                        enrollmentId,
                        status
                );
    }
}