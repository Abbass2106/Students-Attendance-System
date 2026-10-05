package com.example.student_attendance.services;

import com.example.student_attendance.Exceptions.ApiException;
import com.example.student_attendance.models.Classes;
import com.example.student_attendance.models.Enrollment;
import com.example.student_attendance.repositories.ClassesRepository;
import com.example.student_attendance.repositories.EnrollmentRepository;
import com.example.student_attendance.repositories.StudentRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EnrollmentService {

        public static final String ACTIVE = "ACTIVE";
        public static final String WITHDRAWN = "WITHDRAWN";

        private final EnrollmentRepository enrollmentRepository;
        private final StudentRepository studentRepository;
        private final ClassesRepository classesRepository;

        public EnrollmentService(
                        EnrollmentRepository enrollmentRepository,
                        StudentRepository studentRepository,
                        ClassesRepository classesRepository) {
                this.enrollmentRepository = enrollmentRepository;
                this.studentRepository = studentRepository;
                this.classesRepository = classesRepository;
        }

        public Enrollment enrollStudent(Long studentId, Long classId) {

                if (studentId == null || classId == null) {
                        throw new ApiException("studentId and classId are required", 400);
                }

                if (!studentRepository.existsById(studentId)) {
                        throw new ApiException("Student not found", 404);
                }

                Classes classes = classesRepository.findById(classId)
                                .orElseThrow(() -> new ApiException("Class not found", 404));

                Enrollment existing = enrollmentRepository
                                .findByStudentIdAndClassId(studentId, classId)
                                .orElse(null);

                if (existing != null && ACTIVE.equals(existing.getStatus())) {
                        throw new ApiException("Student is already enrolled in this class", 409);
                }

                if (classes.getCapacity() != null &&
                                enrollmentRepository.countByClassIdAndStatus(classId, ACTIVE)
                                                >= classes.getCapacity()) {
                        throw new ApiException("Class is full", 409);
                }

                // Re-enrolling a previously withdrawn student re-activates the same
                // row, so their old attendance history stays attached to it.
                if (existing != null) {
                        existing.setStatus(ACTIVE);
                        existing.setWithdrawnAt(null);
                        return enrollmentRepository.save(existing);
                }

                Enrollment enrollment = new Enrollment();
                enrollment.setStudentId(studentId);
                enrollment.setClassId(classId);
                enrollment.setStatus(ACTIVE);

                return enrollmentRepository.save(enrollment);
        }

        public List<Enrollment> getStudentEnrollments(Long studentId) {

                if (!studentRepository.existsById(studentId)) {
                        throw new ApiException("Student not found", 404);
                }

                return enrollmentRepository.findByStudentId(studentId);
        }

        public List<Enrollment> getClassEnrollments(Long classId) {

                if (!classesRepository.existsById(classId)) {
                        throw new ApiException("Class not found", 404);
                }

                return enrollmentRepository.findByClassId(classId);
        }

        public Enrollment getEnrollment(Long studentId, Long classId) {

                return enrollmentRepository
                                .findByStudentIdAndClassId(studentId, classId)
                                .orElseThrow(() -> new ApiException("Enrollment not found", 404));
        }

        // CHANGED: "removing" an enrollment now WITHDRAWS it instead of deleting the
        // row. Deleting would orphan every attendance record that points at it and
        // break historical reports (the whole point of the Enrollment layer).
        public void removeEnrollment(Long studentId, Long classId) {

                Enrollment enrollment = getEnrollment(studentId, classId);

                if (WITHDRAWN.equals(enrollment.getStatus())) {
                        return;
                }

                enrollment.setStatus(WITHDRAWN);
                enrollment.setWithdrawnAt(LocalDateTime.now());

                enrollmentRepository.save(enrollment);
        }

        public void verifyTeacherOwnsClass(Long classId, Long teacherId) {

                Classes classes = classesRepository.findById(classId)
                                .orElseThrow(() -> new ApiException("Class not found", 404));

                if (classes.getLecturerId() == null ||
                                !classes.getLecturerId().equals(teacherId)) {

                        throw new ApiException("You are not assigned to this class", 403);
                }
        }

        public List<Enrollment> getClassEnrollmentsForTeacher(Long classId, Long teacherId) {
                verifyTeacherOwnsClass(classId, teacherId);
                return enrollmentRepository.findByClassId(classId);
        }

        public Enrollment getEnrollmentForTeacher(Long studentId, Long classId, Long teacherId) {
                verifyTeacherOwnsClass(classId, teacherId);
                return getEnrollment(studentId, classId);
        }

        public void removeEnrollmentForTeacher(Long studentId, Long classId, Long teacherId) {
                verifyTeacherOwnsClass(classId, teacherId);
                removeEnrollment(studentId, classId);
        }
}