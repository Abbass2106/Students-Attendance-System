package com.example.student_attendance.controllers;

import com.example.student_attendance.models.Students;
import com.example.student_attendance.services.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            @RequestBody Students student
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(studentService.createStudent(student));
    }

    @GetMapping
    public ResponseEntity<List<Students>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
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