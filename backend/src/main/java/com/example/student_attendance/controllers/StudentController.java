package com.example.student_attendance.controllers;

import com.example.student_attendance.services.StudentService;

import jakarta.validation.Valid;

import com.example.student_attendance.models.Students;

import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService=studentService;
    }

    //post api
    @PostMapping
    public Students createStudents(@Valid @RequestBody Students students){
        return studentService.createStudents(students);
    }

    //get api
    @GetMapping
    public List<Students> getAllStudents(){
        return studentService.getAllStudents();
    }

    //get by id api
    @GetMapping("/{id}")
    public Students getStudentsById(@PathVariable Long id){
        return studentService.getStudentById(id);
    }

    //put api
    @PutMapping("/{id}")
    public Students editStudents(@Valid @RequestBody Students students,@PathVariable Long id){
        return studentService.editStudents(students, id);
    }

    //delete api
    @DeleteMapping("/{id}")
    public String deleteStudents (@PathVariable Long id){

        boolean deleted=studentService.deleteStudent(id);
       
        if(!deleted){
             return "Student not found";
        }

        return "student deleted successfully";
    }    
    
}
