package com.example.student_attendance.controllers;

import com.example.student_attendance.models.Enrollment;
import com.example.student_attendance.models.Role;
import com.example.student_attendance.models.User;
import com.example.student_attendance.services.EnrollmentService;
import com.example.student_attendance.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

        private final EnrollmentService enrollmentService;
        private final UserService userService;

        public EnrollmentController(
                        EnrollmentService enrollmentService,
                        UserService userService) {
                this.enrollmentService = enrollmentService;
                this.userService = userService;
        }

        @PostMapping
        public ResponseEntity<Enrollment> createEnrollment(
                        @RequestBody Enrollment enrollment,
                        Authentication authentication) {
                User me = userService.getUserByEmail(
                                authentication.getName());

                Enrollment created;

                if (me.getRole() == Role.TEACHER) {

                        enrollmentService.verifyTeacherOwnsClass(
                                        enrollment.getClassId(),
                                        me.getId());
                }

                created = enrollmentService.enrollStudent(
                                enrollment.getStudentId(),
                                enrollment.getClassId());

                return ResponseEntity
                                .status(HttpStatus.CREATED)
                                .body(created);
        }

        @GetMapping("/student/{studentId}")
        public ResponseEntity<List<Enrollment>> getStudentEnrollments(
                        @PathVariable Long studentId) {
                return ResponseEntity.ok(
                                enrollmentService.getStudentEnrollments(studentId));
        }

        @GetMapping("/class/{classId}")
        public ResponseEntity<List<Enrollment>> getClassEnrollments(
                        @PathVariable Long classId,
                        Authentication authentication) {
                User me = userService.getUserByEmail(
                                authentication.getName());

                if (me.getRole() == Role.TEACHER) {

                        return ResponseEntity.ok(
                                        enrollmentService.getClassEnrollmentsForTeacher(
                                                        classId,
                                                        me.getId()));
                }

                return ResponseEntity.ok(
                                enrollmentService.getClassEnrollments(classId));
        }

        @GetMapping("/student/{studentId}/class/{classId}")
        public ResponseEntity<Enrollment> getEnrollment(
                        @PathVariable Long studentId,
                        @PathVariable Long classId,
                        Authentication authentication) {
                User me = userService.getUserByEmail(
                                authentication.getName());

                if (me.getRole() == Role.TEACHER) {

                        return ResponseEntity.ok(
                                        enrollmentService.getEnrollmentForTeacher(
                                                        studentId,
                                                        classId,
                                                        me.getId()));
                }

                return ResponseEntity.ok(
                                enrollmentService.getEnrollment(
                                                studentId,
                                                classId));
        }

        @DeleteMapping("/student/{studentId}/class/{classId}")
        public ResponseEntity<Void> removeEnrollment(
                        @PathVariable Long studentId,
                        @PathVariable Long classId,
                        Authentication authentication) {
                User me = userService.getUserByEmail(
                                authentication.getName());

                if (me.getRole() == Role.TEACHER) {

                        enrollmentService.removeEnrollmentForTeacher(
                                        studentId,
                                        classId,
                                        me.getId());

                } else {

                        enrollmentService.removeEnrollment(
                                        studentId,
                                        classId);
                }

                return ResponseEntity.noContent().build();
        }
}