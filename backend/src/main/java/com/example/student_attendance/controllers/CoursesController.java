package com.example.student_attendance.controllers;

import com.example.student_attendance.models.Courses;
import com.example.student_attendance.services.CoursesService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CoursesController {

    private final CoursesService coursesService;

    public CoursesController(
            CoursesService coursesService
    ) {
        this.coursesService = coursesService;
    }

    @PostMapping
    public ResponseEntity<Courses> createCourse(
            @RequestBody Courses course
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        coursesService.createCourse(course)
                );
    }

    @GetMapping
    public ResponseEntity<List<Courses>> getAllCourses() {

        return ResponseEntity.ok(
                coursesService.getAllCourses()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Courses> getCourseById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                coursesService.getCourseById(id)
        );
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<Courses> getCourseByCode(
            @PathVariable String code
    ) {

        return ResponseEntity.ok(
                coursesService.getCourseByCode(code)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Courses> updateCourse(
            @PathVariable Long id,
            @RequestBody Courses course
    ) {

        return ResponseEntity.ok(
                coursesService.updateCourse(
                        id,
                        course
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(
            @PathVariable Long id
    ) {

        coursesService.deleteCourse(id);

        return ResponseEntity.noContent().build();
    }
}