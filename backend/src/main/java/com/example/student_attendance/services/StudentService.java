package com.example.student_attendance.services;

import org.springframework.stereotype.Service;
import com.example.student_attendance.models.Students;
import com.example.student_attendance.Exceptions.ApiException;
import com.example.student_attendance.models.Classes;

import com.example.student_attendance.repositories.StudentRepository;
import com.example.student_attendance.repositories.ClassRepository;

import java.util.List;


@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final ClassRepository classRepository;

    public StudentService(StudentRepository studentRepository, ClassRepository classRepository) {
        this.studentRepository=studentRepository;
        this.classRepository=classRepository;
    }

    //create students
    public Students createStudents(Students students){

        Long classId = students.getClasses().getId();
        Classes classes = classRepository.findById(classId).orElse(null);
        students.setClasses(classes);

        return studentRepository.save(students);
    }

    //read students
    public List<Students> getAllStudents(){
        return studentRepository.findAll();
    }

    //read by id
    public Students getStudentById(Long id){
        Students students = studentRepository.findById(id).orElse(null);

        if(students == null){
            throw new ApiException("Student not found", 404);
        }

        return students;
    }

    //read students by class
    public List<Students> getStudentsByClass(Long classId){
        return studentRepository.findByClassesId(classId);
    }

    //edit student
    public Students editStudents(Students students,Long id){
        Students existingStudent=studentRepository.findById(id).orElse(null);
        
        if(existingStudent == null){
            throw new ApiException("Student not found", 404);
        }

        existingStudent.setFirstName(students.getFirstName());
        existingStudent.setLastName(students.getLastName());
        existingStudent.setEmail(students.getEmail());
        existingStudent.setClasses(students.getClasses());

        return studentRepository.save(existingStudent);
    }

    //delete student
    public boolean deleteStudent(Long id){
     studentRepository.deleteById(id);
     return true;
    }

    
    
}
