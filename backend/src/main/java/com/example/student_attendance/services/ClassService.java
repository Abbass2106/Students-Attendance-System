package com.example.student_attendance.services;

import com.example.student_attendance.Exceptions.ApiException;
import com.example.student_attendance.models.Classes;
import com.example.student_attendance.repositories.ClassRepository;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class ClassService {

    private final ClassRepository classRepository;

    public ClassService(ClassRepository classRepository) {
        this.classRepository=classRepository;
    }

    //create class
    public Classes createClasses(Classes classes){
        return classRepository.save(classes);
    }

    //read class
    public List<Classes> getClasses(){
        return classRepository.findAll();
    }

    //read class by id
    public Classes getClassesById(Long classId){
        Classes classes=classRepository.findById(classId).orElse(null);

        if(classes == null){
            throw new ApiException("Class not found", 404);
        }
        return classes;
    }

    //update class
    public Classes updateClass(Classes classes, Long id){
        Classes existingClass = classRepository.findById(id).orElse(null);

        if(existingClass == null){
            throw new ApiException("Class not found", 404);
        }

        existingClass.setName(classes.getName());
        return classRepository.save(existingClass);
    }

    
    //delete class
    public void deleteClass(Long id){
        classRepository.deleteById(id);    
    } 
}
