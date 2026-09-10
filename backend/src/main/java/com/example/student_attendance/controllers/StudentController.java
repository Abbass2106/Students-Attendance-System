package com.example.student_attendance.controllers;

import com.example.student_attendance.models.Enrollment;
import com.example.student_attendance.models.StudentAttendanceSummaryDTO;
import com.example.student_attendance.models.StudentsImportSummary;
import com.example.student_attendance.models.Students;
import com.example.student_attendance.services.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping
    public ResponseEntity<Students> createStudent(
            @Valid @RequestBody Students student
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(studentService.createStudent(student));
    }

    @GetMapping
    public ResponseEntity<List<Students>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    // Bulk import (ADMIN only — see SecurityConfig, which restricts this
    // specific route to ADMIN even though the broader /api/students/**
    // pattern also allows TEACHER). Processes every row it can and
    // reports per-row results rather than failing the whole file on the
    // first bad row.
    @PostMapping("/import")
    public ResponseEntity<StudentsImportSummary> importStudents(
            @RequestParam("file") MultipartFile file
    ) {
        return ResponseEntity.ok(
                studentService.importStudents(file)
        );
    }

    // ---- Student self-service ("/me") ----
    // These resolve the Students profile linked to the logged-in user via
    // their email, so a STUDENT can view their own data without knowing
    // any internal ids. Only these three routes are opened to STUDENT in
    // SecurityConfig; every other /api/students/** route stays ADMIN/TEACHER.

    @GetMapping("/me")
    public ResponseEntity<Students> getMyProfile(
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                studentService.getStudentByEmail(
                        authentication.getName()
                )
        );
    }

    @GetMapping("/me/enrollments")
    public ResponseEntity<List<Enrollment>> getMyEnrollments(
            Authentication authentication
    ) {
        Students me = studentService.getStudentByEmail(
                authentication.getName()
        );

        return ResponseEntity.ok(
                studentService.getMyEnrollments(me.getId())
        );
    }

    @GetMapping("/me/attendance")
    public ResponseEntity<List<StudentAttendanceSummaryDTO>> getMyAttendance(
            Authentication authentication
    ) {
        Students me = studentService.getStudentByEmail(
                authentication.getName()
        );

        return ResponseEntity.ok(
                studentService.getAttendanceSummary(me.getId())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Students> getStudentById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                studentService.getStudentById(id)
        );
    }

    @GetMapping("/number/{studentNumber}")
    public ResponseEntity<Students> getStudentByNumber(
            @PathVariable String studentNumber
    ) {
        return ResponseEntity.ok(
                studentService.getStudentByNumber(studentNumber)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Students> updateStudent(
            @PathVariable Long id,
            @RequestBody Students student
    ) {
        return ResponseEntity.ok(
                studentService.updateStudent(id, student)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(
            @PathVariable Long id
    ) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
}