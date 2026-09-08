package com.example.student_attendance.services;

import com.example.student_attendance.Exceptions.ApiException;
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

        if (studentRepository.existsByStudentNumber(
                student.getStudentNumber())) {

            throw new ApiException(
                    "Student number already exists",
                    409
            );
        }

        if (studentRepository.existsByEmail(
                student.getEmail())) {

            throw new ApiException(
                    "Email already exists",
                    409
            );
        }

        if (student.getStatus() == null ||
                student.getStatus().isBlank()) {

            student.setStatus("ACTIVE");
        }

        return studentRepository.save(student);
    }

    public List<Students> getAllStudents() {
        return studentRepository.findAll();
    }

    public Students getStudentById(Long id) {

        return studentRepository.findById(id)
                .orElseThrow(() ->
                        new ApiException(
                                "Student not found with id: " + id,
                                404
                        ));
    }

    public Students getStudentByNumber(String studentNumber) {

        return studentRepository
                .findByStudentNumber(studentNumber)
                .orElseThrow(() ->
                        new ApiException(
                                "Student not found with number: "
                                        + studentNumber,
                                404
                        ));
    }

    public Students updateStudent(
            Long id,
            Students updatedStudent
    ) {

        Students existingStudent = getStudentById(id);

        if (studentRepository.existsByStudentNumberAndIdNot(
                updatedStudent.getStudentNumber(),
                id)) {

            throw new ApiException(
                    "Student number already exists",
                    409
            );
        }

        if (studentRepository.existsByEmailAndIdNot(
                updatedStudent.getEmail(),
                id)) {

            throw new ApiException(
                    "Email already exists",
                    409
            );
        }

        existingStudent.setStudentNumber(
                updatedStudent.getStudentNumber()
        );

        existingStudent.setFirstName(
                updatedStudent.getFirstName()
        );

        existingStudent.setLastName(
                updatedStudent.getLastName()
        );

        existingStudent.setEmail(
                updatedStudent.getEmail()
        );

        existingStudent.setPhone(
                updatedStudent.getPhone()
        );

        existingStudent.setProgramId(
                updatedStudent.getProgramId()
        );

        existingStudent.setYear(
                updatedStudent.getYear()
        );

        existingStudent.setSemester(
                updatedStudent.getSemester()
        );

        if (updatedStudent.getStatus() != null &&
                !updatedStudent.getStatus().isBlank()) {

            existingStudent.setStatus(
                    updatedStudent.getStatus()
            );
        }

        return studentRepository.save(existingStudent);
    }

    public void deleteStudent(Long id) {

        Students student = getStudentById(id);

        studentRepository.delete(student);
    }
}