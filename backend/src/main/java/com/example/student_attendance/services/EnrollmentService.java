package com.example.student_attendance.services;

import com.example.student_attendance.models.Enrollment;
import com.example.student_attendance.repositories.ClassesRepository;
import com.example.student_attendance.repositories.EnrollmentRepository;
import com.example.student_attendance.repositories.StudentRepository;
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
            ClassesRepository classesRepository
    ) {
        this.enrollmentRepository = enrollmentRepository;
        this.studentRepository = studentRepository;
        this.classesRepository = classesRepository;
    }

    public Enrollment enrollStudent(Long studentId, Long classId) {

        studentRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found"));

        classesRepository.findById(classId)
            .orElseThrow(() -> new RuntimeException("Class not found"));

        boolean alreadyEnrolled =
            enrollmentRepository.existsByStudentIdAndClassId(
                        studentId,
                        classId
                );

        if (alreadyEnrolled) {
            throw new RuntimeException(
                    "Student is already enrolled in this class"
            );
        }

        Enrollment enrollment = new Enrollment();

        enrollment.setStudentId(studentId);
        enrollment.setClassId(classId);

        return enrollmentRepository.save(enrollment);
    }

    public List<Enrollment> getStudentEnrollments(Long studentId) {

        if (!studentRepository.existsById(studentId)) {
            throw new RuntimeException("Student not found");
        }

        return enrollmentRepository.findByStudentId(studentId);
    }

    public List<Enrollment> getClassEnrollments(Long classId) {

        if (!classesRepository.existsById(classId)) {
            throw new RuntimeException("Class not found");
        }

        return enrollmentRepository.findByClassId(classId);
    }

    public Enrollment getEnrollment(Long studentId, Long classId) {

        return enrollmentRepository
                .findByStudentIdAndClassId(studentId, classId)
                .orElseThrow(() ->
                        new RuntimeException("Enrollment not found"));
    }

    public void removeEnrollment(Long studentId, Long classId) {

        Enrollment enrollment = getEnrollment(studentId, classId);

        enrollmentRepository.delete(enrollment);
    }
}