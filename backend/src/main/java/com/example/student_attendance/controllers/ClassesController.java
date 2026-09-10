package com.example.student_attendance.controllers;

import com.example.student_attendance.models.Classes;
import com.example.student_attendance.models.Enrollment;
import com.example.student_attendance.models.User;
import com.example.student_attendance.services.ClassesService;
import com.example.student_attendance.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/classes")
public class ClassesController {

    private final ClassesService classesService;
    private final UserService userService;

    public ClassesController(
            ClassesService classesService,
            UserService userService
    ) {
        this.classesService = classesService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<Classes> createClass(
            @RequestBody Classes classes
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        classesService.createClass(classes)
                );
    }

    @GetMapping
    public ResponseEntity<List<Classes>> getAllClasses() {

        return ResponseEntity.ok(
                classesService.getAllClasses()
        );
    }

    // Scoped to the logged-in TEACHER: only classes assigned to them.
    // (Also works for ADMIN, returning whatever classes happen to be
    // assigned to that admin's user id, which is normally none.)
    @GetMapping("/mine")
    public ResponseEntity<List<Classes>> getMyClasses(
            Authentication authentication
    ) {
        User me = userService.getUserByEmail(
                authentication.getName()
        );

        return ResponseEntity.ok(
                classesService.getMyClasses(me.getId())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Classes> getClassById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                classesService.getClassById(id)
        );
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<Classes> getClassByCode(
            @PathVariable String code
    ) {

        return ResponseEntity.ok(
                classesService.getClassByCode(code)
        );
    }

    @GetMapping("/{id}/student-count")
    public ResponseEntity<Map<String, Object>> getStudentCount(
            @PathVariable Long id
    ) {

        Classes classes =
                classesService.getClassById(id);

        long studentCount =
                classesService.getStudentCount(id);

        Map<String, Object> response =
                new HashMap<>();

        response.put("classId", classes.getId());
        response.put("classCode", classes.getCode());
        response.put("studentCount", studentCount);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/enrollments")
    public ResponseEntity<List<Enrollment>>
    getClassEnrollments(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                classesService.getEnrollmentsByClass(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Classes> updateClass(
            @PathVariable Long id,
            @RequestBody Classes classes
    ) {

        return ResponseEntity.ok(
                classesService.updateClass(
                        id,
                        classes
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClass(
            @PathVariable Long id
    ) {

        classesService.deleteClass(id);

        return ResponseEntity.noContent().build();
    }
}