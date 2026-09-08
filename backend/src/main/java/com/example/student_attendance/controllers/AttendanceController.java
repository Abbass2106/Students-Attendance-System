package com.example.student_attendance.controllers;

import com.example.student_attendance.models.Attendance;
import com.example.student_attendance.models.AttendanceStatus;
import com.example.student_attendance.services.AttendanceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(
            AttendanceService attendanceService
    ) {
        this.attendanceService = attendanceService;
    }

    @PostMapping
    public ResponseEntity<Attendance> createAttendance(
            @RequestParam Long sessionId,
            @RequestParam Long enrollmentId,
            @RequestParam AttendanceStatus status
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        attendanceService.createAttendance(
                                sessionId,
                                enrollmentId,
                                status
                        )
                );
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<Attendance>> getAttendanceBySession(
            @PathVariable Long sessionId
    ) {
        return ResponseEntity.ok(
                attendanceService.getAttendanceBySession(
                        sessionId
                )
        );
    }

    @GetMapping("/enrollment/{enrollmentId}")
    public ResponseEntity<List<Attendance>> getAttendanceByEnrollment(
            @PathVariable Long enrollmentId
    ) {
        return ResponseEntity.ok(
                attendanceService.getAttendanceByEnrollment(
                        enrollmentId
                )
        );
    }

    @GetMapping("/session/{sessionId}/enrollment/{enrollmentId}")
    public ResponseEntity<Attendance> getAttendance(
            @PathVariable Long sessionId,
            @PathVariable Long enrollmentId
    ) {
        return ResponseEntity.ok(
                attendanceService.getAttendance(
                        sessionId,
                        enrollmentId
                )
        );
    }

    @PutMapping("/session/{sessionId}/enrollment/{enrollmentId}")
    public ResponseEntity<Attendance> updateAttendance(
            @PathVariable Long sessionId,
            @PathVariable Long enrollmentId,
            @RequestParam AttendanceStatus status
    ) {
        return ResponseEntity.ok(
                attendanceService.updateAttendance(
                        sessionId,
                        enrollmentId,
                        status
                )
        );
    }

    @DeleteMapping("/session/{sessionId}/enrollment/{enrollmentId}")
    public ResponseEntity<Void> deleteAttendance(
            @PathVariable Long sessionId,
            @PathVariable Long enrollmentId
    ) {
        attendanceService.deleteAttendance(
                sessionId,
                enrollmentId
        );

        return ResponseEntity.noContent().build();
    }
}