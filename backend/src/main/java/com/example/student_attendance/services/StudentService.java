package com.example.student_attendance.services;

import com.example.student_attendance.models.Students;
import com.example.student_attendance.repositories.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Students createStudent(Students student) {

        if (studentRepository.existsByStudentNumber(student.getStudentNumber())) {
            throw new RuntimeException("Student number already exists");
        }

        if (studentRepository.existsByEmail(student.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        return studentRepository.save(student);
    }

    public List<Students> getAllStudents() {
        return studentRepository.findAll();
    }

    public Students getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Student not found with id: " + id));
    }

    public Students getStudentByNumber(String studentNumber) {
        return studentRepository.findByStudentNumber(studentNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student not found with number: " + studentNumber
                        ));
    }

    public Students updateStudent(Long id, Students updatedStudent) {

        Students existingStudent = getStudentById(id);

        existingStudent.setFirstName(updatedStudent.getFirstName());
        existingStudent.setLastName(updatedStudent.getLastName());
        existingStudent.setEmail(updatedStudent.getEmail());

        return studentRepository.save(existingStudent);
    }

    public void deleteStudent(Long id) {

        Students student = getStudentById(id);

        studentRepository.delete(student);
    }
}