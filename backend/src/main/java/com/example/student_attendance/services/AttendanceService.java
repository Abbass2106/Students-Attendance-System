package com.example.student_attendance.services;

import com.example.student_attendance.Exceptions.ApiException;
import com.example.student_attendance.models.Attendance;
import com.example.student_attendance.models.AttendanceStatus;
import com.example.student_attendance.models.AttendanceSession;
import com.example.student_attendance.models.Enrollment;
import com.example.student_attendance.repositories.AttendanceRepository;
import com.example.student_attendance.repositories.AttendanceSessionRepository;
import com.example.student_attendance.repositories.EnrollmentRepository;
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

        AttendanceSession session =
                sessionRepository.findById(sessionId)
                        .orElseThrow(() ->
                                new ApiException(
                                        "Attendance session not found",
                                        404
                                ));

        Enrollment enrollment =
                enrollmentRepository.findById(enrollmentId)
                        .orElseThrow(() ->
                                new ApiException(
                                        "Enrollment not found",
                                        404
                                ));

        if (enrollment.getClassId() == null ||
                !enrollment.getClassId()
                        .equals(session.getClassId())) {

            throw new ApiException(
                    "Enrollment does not belong to this class",
                    400
            );
        }

        if (status == null) {
            throw new ApiException(
                    "Attendance status is required",
                    400
            );
        }

        if (attendanceRepository
                .existsBySessionIdAndEnrollmentId(
                        sessionId,
                        enrollmentId
                )) {

            throw new ApiException(
                    "Attendance already exists for this student",
                    409
            );
        }

        Attendance attendance = new Attendance();

        attendance.setSessionId(sessionId);
        attendance.setEnrollmentId(enrollmentId);
        attendance.setStatus(status);

        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getAttendanceBySession(
            Long sessionId
    ) {

        if (!sessionRepository.existsById(sessionId)) {
            throw new ApiException(
                    "Attendance session not found",
                    404
            );
        }

        return attendanceRepository.findBySessionId(sessionId);
    }

    public List<Attendance> getAttendanceByEnrollment(
            Long enrollmentId
    ) {

        if (!enrollmentRepository.existsById(enrollmentId)) {
            throw new ApiException(
                    "Enrollment not found",
                    404
            );
        }

        return attendanceRepository.findByEnrollmentId(
                enrollmentId
        );
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
                        new ApiException(
                                "Attendance not found",
                                404
                        ));
    }

    public Attendance updateAttendance(
            Long sessionId,
            Long enrollmentId,
            AttendanceStatus status
    ) {

        if (status == null) {
            throw new ApiException(
                    "Attendance status is required",
                    400
            );
        }

        Attendance attendance =
                getAttendance(
                        sessionId,
                        enrollmentId
                );

        attendance.setStatus(status);

        return attendanceRepository.save(attendance);
    }

    public void deleteAttendance(
            Long sessionId,
            Long enrollmentId
    ) {

        Attendance attendance =
                getAttendance(
                        sessionId,
                        enrollmentId
                );

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