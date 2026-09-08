package com.example.student_attendance.controllers;

import com.example.student_attendance.models.Enrollment;
import com.example.student_attendance.services.EnrollmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(
            EnrollmentService enrollmentService
    ) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping
    public ResponseEntity<Enrollment> enrollStudent(
            @RequestParam Long studentId,
            @RequestParam Long classId
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        enrollmentService.enrollStudent(
                                studentId,
                                classId
                        )
                );
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Enrollment>> getStudentEnrollments(
            @PathVariable Long studentId
    ) {
        return ResponseEntity.ok(
                enrollmentService.getStudentEnrollments(studentId)
        );
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<List<Enrollment>> getClassEnrollments(
            @PathVariable Long classId
    ) {
        return ResponseEntity.ok(
                enrollmentService.getClassEnrollments(classId)
        );
    }

    @GetMapping("/student/{studentId}/class/{classId}")
    public ResponseEntity<Enrollment> getEnrollment(
            @PathVariable Long studentId,
            @PathVariable Long classId
    ) {
        return ResponseEntity.ok(
                enrollmentService.getEnrollment(
                        studentId,
                        classId
                )
        );
    }

    @DeleteMapping("/student/{studentId}/class/{classId}")
    public ResponseEntity<Void> removeEnrollment(
            @PathVariable Long studentId,
            @PathVariable Long classId
    ) {
        enrollmentService.removeEnrollment(
                studentId,
                classId
        );

        return ResponseEntity.noContent().build();
    }
}