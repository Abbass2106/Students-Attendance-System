package com.example.student_attendance.controllers;

import com.example.student_attendance.models.AttendanceSession;
import com.example.student_attendance.services.AttendanceSessionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance-sessions")
public class AttendanceSessionController {

    private final AttendanceSessionService sessionService;

    public AttendanceSessionController(
            AttendanceSessionService sessionService
    ) {
        this.sessionService = sessionService;
    }

    @PostMapping
    public ResponseEntity<AttendanceSession> createSession(
            @RequestParam Long classId,
            @RequestBody AttendanceSession session
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        sessionService.createSession(
                                session,
                                classId
                        )
                );
    }

    @GetMapping
    public ResponseEntity<List<AttendanceSession>> getAllSessions() {
        return ResponseEntity.ok(
                sessionService.getAllSessions()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttendanceSession> getSessionById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                sessionService.getSessionById(id)
        );
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<List<AttendanceSession>> getSessionsByClass(
            @PathVariable Long classId
    ) {
        return ResponseEntity.ok(
                sessionService.getSessionsByClass(classId)
        );
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<AttendanceSession>> getSessionsByDate(
            @PathVariable LocalDate date
    ) {
        return ResponseEntity.ok(
                sessionService.getSessionsByDate(date)
        );
    }

    @GetMapping("/class/{classId}/date/{date}")
    public ResponseEntity<List<AttendanceSession>>
    getSessionsByClassAndDate(
            @PathVariable Long classId,
            @PathVariable LocalDate date
    ) {
        return ResponseEntity.ok(
                sessionService.getSessionsByClassAndDate(
                        classId,
                        date
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(
            @PathVariable Long id
    ) {
        sessionService.deleteSession(id);

        return ResponseEntity.noContent().build();
    }
}