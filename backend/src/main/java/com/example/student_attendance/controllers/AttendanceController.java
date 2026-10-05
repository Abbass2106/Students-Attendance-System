package com.example.student_attendance.controllers;

import com.example.student_attendance.models.Attendance;
import com.example.student_attendance.models.AttendanceDtos.BulkRequest;
import com.example.student_attendance.models.AttendanceDtos.RecordView;
import com.example.student_attendance.models.AttendanceStatus;
import com.example.student_attendance.models.AttendanceSummary;
import com.example.student_attendance.models.User;
import com.example.student_attendance.services.AttendanceService;
import com.example.student_attendance.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final UserService userService;

    public AttendanceController(
            AttendanceService attendanceService,
            UserService userService
    ) {
        this.attendanceService = attendanceService;
        this.userService = userService;
    }

    private User me(Authentication authentication) {
        return userService.getUserByEmail(authentication.getName());
    }

    // ---------------- NEW: register-style endpoints used by the UI ----------------

    // Take / correct the register for one class on one date.
    @PostMapping("/bulk")
    public ResponseEntity<List<RecordView>> markBulk(
            @RequestBody BulkRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                attendanceService.markBulk(request, me(authentication))
        );
    }

    // Most recent records (dashboard).
    @GetMapping
    public ResponseEntity<List<RecordView>> getRecent(Authentication authentication) {
        return ResponseEntity.ok(attendanceService.getRecent(me(authentication)));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<RecordView>> getByDate(
            @PathVariable LocalDate date,
            Authentication authentication
    ) {
        return ResponseEntity.ok(attendanceService.getByDate(date, me(authentication)));
    }

    @GetMapping("/class/{classId}/date/{date}")
    public ResponseEntity<List<RecordView>> getByClassAndDate(
            @PathVariable Long classId,
            @PathVariable LocalDate date,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                attendanceService.getClassAttendanceForDate(classId, date, me(authentication))
        );
    }

    // ---------------- NEW: reports ----------------

    @GetMapping("/student/{studentId}/summary")
    public ResponseEntity<AttendanceSummary> getStudentSummary(
            @PathVariable Long studentId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                attendanceService.getStudentSummary(studentId, me(authentication))
        );
    }

    @GetMapping("/class/{classId}/summary")
    public ResponseEntity<AttendanceSummary> getClassSummary(
            @PathVariable Long classId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                attendanceService.getClassSummary(classId, me(authentication))
        );
    }

    // ---------------- Existing single-record endpoints (now ownership-checked) ----------------

    @PostMapping
    public ResponseEntity<Attendance> createAttendance(
            @RequestParam Long sessionId,
            @RequestParam Long enrollmentId,
            @RequestParam AttendanceStatus status,
            Authentication authentication
    ) {
        User user = me(authentication);
        attendanceService.assertSessionAccess(sessionId, user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(attendanceService.createAttendance(
                        sessionId, enrollmentId, status, user.getId()));
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<Attendance>> getAttendanceBySession(
            @PathVariable Long sessionId,
            Authentication authentication
    ) {
        attendanceService.assertSessionAccess(sessionId, me(authentication));
        return ResponseEntity.ok(attendanceService.getAttendanceBySession(sessionId));
    }

    @GetMapping("/enrollment/{enrollmentId}")
    public ResponseEntity<List<Attendance>> getAttendanceByEnrollment(
            @PathVariable Long enrollmentId,
            Authentication authentication
    ) {
        attendanceService.assertEnrollmentAccess(enrollmentId, me(authentication));
        return ResponseEntity.ok(attendanceService.getAttendanceByEnrollment(enrollmentId));
    }

    @GetMapping("/session/{sessionId}/enrollment/{enrollmentId}")
    public ResponseEntity<Attendance> getAttendance(
            @PathVariable Long sessionId,
            @PathVariable Long enrollmentId,
            Authentication authentication
    ) {
        attendanceService.assertSessionAccess(sessionId, me(authentication));
        return ResponseEntity.ok(attendanceService.getAttendance(sessionId, enrollmentId));
    }

    @PutMapping("/session/{sessionId}/enrollment/{enrollmentId}")
    public ResponseEntity<Attendance> updateAttendance(
            @PathVariable Long sessionId,
            @PathVariable Long enrollmentId,
            @RequestParam AttendanceStatus status,
            Authentication authentication
    ) {
        User user = me(authentication);
        attendanceService.assertSessionAccess(sessionId, user);

        return ResponseEntity.ok(
                attendanceService.updateAttendance(sessionId, enrollmentId, status, user.getId())
        );
    }

    @DeleteMapping("/session/{sessionId}/enrollment/{enrollmentId}")
    public ResponseEntity<Void> deleteAttendance(
            @PathVariable Long sessionId,
            @PathVariable Long enrollmentId,
            Authentication authentication
    ) {
        attendanceService.assertSessionAccess(sessionId, me(authentication));
        attendanceService.deleteAttendance(sessionId, enrollmentId);

        return ResponseEntity.noContent().build();
    }
}