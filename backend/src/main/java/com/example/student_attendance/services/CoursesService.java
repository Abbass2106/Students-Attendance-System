package com.example.student_attendance.services;

import com.example.student_attendance.models.Courses;
import com.example.student_attendance.repositories.CoursesRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CoursesService {

    private final CoursesRepository coursesRepository;

    public CoursesService(CoursesRepository coursesRepository) {
        this.coursesRepository = coursesRepository;
    }

    public Courses createCourse(Courses course) {

        if (coursesRepository.existsByCode(course.getCode())) {
            throw new RuntimeException("Course code already exists");
        }

        return coursesRepository.save(course);
    }

    public List<Courses> getAllCourses() {
        return coursesRepository.findAll();
    }

    public Courses getCourseById(Long id) {

        return coursesRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Course not found"));
    }

    public Courses getCourseByCode(String code) {

        return coursesRepository.findByCode(code)
                .orElseThrow(() ->
                        new RuntimeException("Course not found"));
    }

    public Courses updateCourse(Long id, Courses updatedCourse) {

        Courses existingCourse = getCourseById(id);

        if (coursesRepository.existsByCodeAndIdNot(updatedCourse.getCode(), id)) {
            throw new RuntimeException("Course code already exists");
        }

        existingCourse.setCode(updatedCourse.getCode());
        existingCourse.setCourseId(updatedCourse.getCourseId());
        existingCourse.setSemester(updatedCourse.getSemester());
        existingCourse.setAcademicYear(updatedCourse.getAcademicYear());
        existingCourse.setLecturerId(updatedCourse.getLecturerId());
        existingCourse.setRoom(updatedCourse.getRoom());
        existingCourse.setCapacity(updatedCourse.getCapacity());
        existingCourse.setStatus(updatedCourse.getStatus());

        return coursesRepository.save(existingCourse);
    }

    public void deleteCourse(Long id) {

        Courses course = getCourseById(id);

        coursesRepository.delete(course);
    }
}