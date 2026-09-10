package com.example.student_attendance.services;

import com.example.student_attendance.Exceptions.ApiException;
import com.example.student_attendance.models.Enrollment;
import com.example.student_attendance.repositories.ClassesRepository;
import com.example.student_attendance.repositories.EnrollmentRepository;
import com.example.student_attendance.repositories.StudentRepository;
import com.example.student_attendance.models.Classes;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnrollmentService {

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

        public Enrollment enrollStudent(
                        Long studentId,
                        Long classId) {

                if (!studentRepository.existsById(studentId)) {
                        throw new ApiException(
                                        "Student not found",
                                        404);
                }

                if (!classesRepository.existsById(classId)) {
                        throw new ApiException(
                                        "Class not found",
                                        404);
                }

                if (enrollmentRepository.existsByStudentIdAndClassId(
                                studentId,
                                classId)) {

                        throw new ApiException(
                                        "Student is already enrolled in this class",
                                        409);
                }

                Enrollment enrollment = new Enrollment();

                enrollment.setStudentId(studentId);
                enrollment.setClassId(classId);
                enrollment.setStatus("ACTIVE");

                return enrollmentRepository.save(enrollment);
        }

        public List<Enrollment> getStudentEnrollments(
                        Long studentId) {

                if (!studentRepository.existsById(studentId)) {
                        throw new ApiException(
                                        "Student not found",
                                        404);
                }

                return enrollmentRepository.findByStudentId(studentId);
        }

        public List<Enrollment> getClassEnrollments(
                        Long classId) {

                if (!classesRepository.existsById(classId)) {
                        throw new ApiException(
                                        "Class not found",
                                        404);
                }

                return enrollmentRepository.findByClassId(classId);
        }

        public Enrollment getEnrollment(
                        Long studentId,
                        Long classId) {

                return enrollmentRepository
                                .findByStudentIdAndClassId(
                                                studentId,
                                                classId)
                                .orElseThrow(() -> new ApiException(
                                                "Enrollment not found",
                                                404));
        }

        public void removeEnrollment(
                        Long studentId,
                        Long classId) {

                Enrollment enrollment = getEnrollment(studentId, classId);

                enrollmentRepository.delete(enrollment);
        }

        public void verifyTeacherOwnsClass(
                        Long classId,
                        Long teacherId) {
                Classes classes = classesRepository.findById(classId)
                                .orElseThrow(() -> new ApiException(
                                                "Class not found",
                                                404));

                if (classes.getLecturerId() == null ||
                                !classes.getLecturerId().equals(teacherId)) {

                        throw new ApiException(
                                        "You are not assigned to this class",
                                        403);
                }
        }

        public List<Enrollment> getClassEnrollmentsForTeacher(
                        Long classId,
                        Long teacherId) {
                verifyTeacherOwnsClass(classId, teacherId);

                return enrollmentRepository.findByClassId(classId);
        }

        public Enrollment getEnrollmentForTeacher(
                        Long studentId,
                        Long classId,
                        Long teacherId) {
                verifyTeacherOwnsClass(classId, teacherId);

                return getEnrollment(studentId, classId);
        }

        public void removeEnrollmentForTeacher(
                        Long studentId,
                        Long classId,
                        Long teacherId) {
                verifyTeacherOwnsClass(classId, teacherId);

                removeEnrollment(studentId, classId);
        }
}