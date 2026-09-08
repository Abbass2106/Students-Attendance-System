package com.example.student_attendance.services;

import com.example.student_attendance.models.Classes;
import com.example.student_attendance.repositories.ClassesRepository;
import com.example.student_attendance.models.Students;
import com.example.student_attendance.repositories.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClassesService {

    private final ClassesRepository classesRepository;
    private final StudentRepository studentRepository;

    public ClassesService(
            ClassesRepository classesRepository,
            StudentRepository studentRepository
    ) {
        this.classesRepository = classesRepository;
        this.studentRepository = studentRepository;
    }

    public Classes createClass(Classes classes) {

        return classesRepository.save(classes);
    }

    public List<Classes> getAllClasses() {
        return classesRepository.findAll();
    }

    public Classes getClassById(Long id) {

        return classesRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Class not found"));
    }

    public Classes updateClass(Long id, Classes updatedClass) {

        Classes existingClass = getClassById(id);

        existingClass.setName(updatedClass.getName());

        return classesRepository.save(existingClass);
    }

    public void deleteClass(Long id) {

        Classes classes = getClassById(id);

        classesRepository.delete(classes);
    }

    public long getStudentCount(Long classId) {

        getClassById(classId);
        return studentRepository.countByClassesId(classId);
    }

    public List<Students> getStudentsByClass(Long classId) {
        getClassById(classId);
        return studentRepository.findByClassesId(classId);
    }
}