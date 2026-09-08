package com.example.student_attendance.services;

import com.example.student_attendance.Exceptions.ApiException;
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
            throw new ApiException(
                    "Course code already exists",
                    409
            );
        }

        return coursesRepository.save(course);
    }

    public List<Courses> getAllCourses() {
        return coursesRepository.findAll();
    }

    public Courses getCourseById(Long id) {

        return coursesRepository.findById(id)
                .orElseThrow(() ->
                        new ApiException(
                                "Course not found",
                                404
                        ));
    }

    public Courses getCourseByCode(String code) {

        return coursesRepository.findByCode(code)
                .orElseThrow(() ->
                        new ApiException(
                                "Course not found",
                                404
                        ));
    }

    public Courses updateCourse(
            Long id,
            Courses updatedCourse
    ) {

        Courses existingCourse = getCourseById(id);

        if (coursesRepository.existsByCodeAndIdNot(
                updatedCourse.getCode(),
                id)) {

            throw new ApiException(
                    "Course code already exists",
                    409
            );
        }

        existingCourse.setCode(updatedCourse.getCode());
        existingCourse.setName(updatedCourse.getName());
        existingCourse.setCredits(updatedCourse.getCredits());
        existingCourse.setDepartmentId(
                updatedCourse.getDepartmentId()
        );

        return coursesRepository.save(existingCourse);
    }

    public void deleteCourse(Long id) {

        Courses course = getCourseById(id);

        coursesRepository.delete(course);
    }
}