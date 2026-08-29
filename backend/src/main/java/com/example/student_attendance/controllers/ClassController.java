package com.example.student_attendance.controllers;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.student_attendance.models.Classes;
import com.example.student_attendance.services.ClassService;

import com.example.student_attendance.models.Students;
import com.example.student_attendance.services.StudentService;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
public class ClassController {

    private final ClassService classService;
    private final StudentService studentService;

    public ClassController(ClassService classService, StudentService studentService) {
        this.classService=classService;
        this.studentService=studentService;
    }


     //create class
     @PostMapping
    public Classes createClasses(@RequestBody Classes classes){
        return classService.createClasses(classes);
    }

    //read class
    @GetMapping
    public List<Classes> getClasses(){
        return classService.getClasses();
    }

    //read students by class
    @GetMapping("/{id}/students")
    public List<Students> getStudentsByClass(@PathVariable Long id){
        return studentService.getStudentsByClass(id);
    }

    //update class
    @PutMapping("/{id}")
    public Classes updateClass(@RequestBody Classes classes, @PathVariable Long id){
        return classService.updateClass(classes, id);
    }

    //delete class
    @DeleteMapping("/{id}")
    public void deleteClass(@PathVariable Long id){
        classService.deleteClass(id);    
    }
}
