package com.example.student_attendance.controllers;

import com.example.student_attendance.models.AttendanceSession;
import com.example.student_attendance.models.User;
import com.example.student_attendance.services.AttendanceSessionService;
import com.example.student_attendance.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance-sessions")
public class AttendanceSessionController {

    private final AttendanceSessionService sessionService;
    private final UserService userService;

    public AttendanceSessionController(
            AttendanceSessionService sessionService,
            UserService userService
    ) {
        this.sessionService = sessionService;
        this.userService = userService;
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

    // Scoped to the logged-in TEACHER: sessions for classes assigned to them.
    @GetMapping("/mine")
    public ResponseEntity<List<AttendanceSession>> getMySessions(
            Authentication authentication
    ) {
        User me = userService.getUserByEmail(
                authentication.getName()
        );

        return ResponseEntity.ok(
                sessionService.getMySessions(me.getId())
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