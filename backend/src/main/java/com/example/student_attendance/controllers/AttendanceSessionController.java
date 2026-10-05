package com.example.student_attendance.controllers;

import com.example.student_attendance.models.AttendanceSession;
import com.example.student_attendance.models.Role;
import com.example.student_attendance.models.User;
import com.example.student_attendance.services.AttendanceSessionService;
import com.example.student_attendance.services.ClassesService;
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
    private final ClassesService classesService;

    public AttendanceSessionController(
            AttendanceSessionService sessionService,
            UserService userService,
            ClassesService classesService
    ) {
        this.sessionService = sessionService;
        this.userService = userService;
        this.classesService = classesService;
    }

    private User me(Authentication authentication) {
        return userService.getUserByEmail(authentication.getName());
    }

    // Throws 403 if a TEACHER is not assigned to the class; no-op for ADMIN.
    private void checkClassAccess(User me, Long classId) {
        if (me.getRole() == Role.TEACHER) {
            classesService.getClassByIdForTeacher(classId, me.getId());
        }
    }

    @PostMapping
    public ResponseEntity<AttendanceSession> createSession(
            @RequestParam Long classId,
            @RequestBody AttendanceSession session,
            Authentication authentication
    ) {
        User user = me(authentication);
        checkClassAccess(user, classId);

        session.setCreatedBy(user.getId());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(sessionService.createSession(session, classId));
    }

    // Admin: every session. Teacher: only sessions for their classes.
    @GetMapping
    public ResponseEntity<List<AttendanceSession>> getAllSessions(Authentication authentication) {
        User user = me(authentication);

        if (user.getRole() == Role.TEACHER) {
            return ResponseEntity.ok(sessionService.getMySessions(user.getId()));
        }

        return ResponseEntity.ok(sessionService.getAllSessions());
    }

    @GetMapping("/mine")
    public ResponseEntity<List<AttendanceSession>> getMySessions(Authentication authentication) {
        return ResponseEntity.ok(sessionService.getMySessions(me(authentication).getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttendanceSession> getSessionById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        AttendanceSession session = sessionService.getSessionById(id);
        checkClassAccess(me(authentication), session.getClassId());

        return ResponseEntity.ok(session);
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<List<AttendanceSession>> getSessionsByClass(
            @PathVariable Long classId,
            Authentication authentication
    ) {
        checkClassAccess(me(authentication), classId);

        return ResponseEntity.ok(sessionService.getSessionsByClass(classId));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<AttendanceSession>> getSessionsByDate(
            @PathVariable LocalDate date,
            Authentication authentication
    ) {
        User user = me(authentication);

        if (user.getRole() == Role.TEACHER) {
            return ResponseEntity.ok(
                    sessionService.getMySessions(user.getId()).stream()
                            .filter(s -> date.equals(s.getDate()))
                            .toList()
            );
        }

        return ResponseEntity.ok(sessionService.getSessionsByDate(date));
    }

    @GetMapping("/class/{classId}/date/{date}")
    public ResponseEntity<List<AttendanceSession>> getSessionsByClassAndDate(
            @PathVariable Long classId,
            @PathVariable LocalDate date,
            Authentication authentication
    ) {
        checkClassAccess(me(authentication), classId);

        return ResponseEntity.ok(sessionService.getSessionsByClassAndDate(classId, date));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(
            @PathVariable Long id,
            Authentication authentication
    ) {
        AttendanceSession session = sessionService.getSessionById(id);
        checkClassAccess(me(authentication), session.getClassId());

        sessionService.deleteSession(id);

        return ResponseEntity.noContent().build();
    }
}