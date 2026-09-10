package com.example.student_attendance.services;

import com.example.student_attendance.Exceptions.ApiException;
import com.example.student_attendance.models.Classes;
import com.example.student_attendance.models.Enrollment;
import com.example.student_attendance.repositories.ClassesRepository;
import com.example.student_attendance.repositories.CoursesRepository;
import com.example.student_attendance.repositories.EnrollmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClassesService {

    private final ClassesRepository classesRepository;
    private final CoursesRepository coursesRepository;
    private final EnrollmentRepository enrollmentRepository;

    public ClassesService(
            ClassesRepository classesRepository,
            CoursesRepository coursesRepository,
            EnrollmentRepository enrollmentRepository
    ) {
        this.classesRepository = classesRepository;
        this.coursesRepository = coursesRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public Classes createClass(Classes classes) {

        if (classesRepository.existsByCode(classes.getCode())) {
            throw new ApiException(
                    "Class code already exists",
                    409
            );
        }

        if (!coursesRepository.existsById(
                classes.getCourseId())) {

            throw new ApiException(
                    "Course not found",
                    404
            );
        }

        if (classes.getStatus() == null ||
                classes.getStatus().isBlank()) {

            classes.setStatus("ACTIVE");
        }

        return classesRepository.save(classes);
    }

    public List<Classes> getAllClasses() {
        return classesRepository.findAll();
    }

    // Scoped view for a TEACHER: only classes where they are the assigned
    // lecturer. lecturerId on Classes stores the User.id of the teacher.
    public List<Classes> getMyClasses(Long lecturerId) {
        return classesRepository.findByLecturerId(lecturerId);
    }

    public Classes getClassById(Long id) {

        return classesRepository.findById(id)
                .orElseThrow(() ->
                        new ApiException(
                                "Class not found",
                                404
                        ));
    }

    public Classes getClassByCode(String code) {

        return classesRepository.findByCode(code)
                .orElseThrow(() ->
                        new ApiException(
                                "Class not found",
                                404
                        ));
    }

    public Classes updateClass(
            Long id,
            Classes updatedClass
    ) {

        Classes existingClass = getClassById(id);

        if (classesRepository.existsByCodeAndIdNot(
                updatedClass.getCode(),
                id)) {

            throw new ApiException(
                    "Class code already exists",
                    409
            );
        }

        if (!coursesRepository.existsById(
                updatedClass.getCourseId())) {

            throw new ApiException(
                    "Course not found",
                    404
            );
        }

        existingClass.setCode(updatedClass.getCode());
        existingClass.setCourseId(updatedClass.getCourseId());
        existingClass.setSemester(updatedClass.getSemester());
        existingClass.setAcademicYear(
                updatedClass.getAcademicYear()
        );
        existingClass.setLecturerId(
                updatedClass.getLecturerId()
        );
        existingClass.setRoom(updatedClass.getRoom());
        existingClass.setCapacity(
                updatedClass.getCapacity()
        );

        if (updatedClass.getStatus() != null &&
                !updatedClass.getStatus().isBlank()) {

            existingClass.setStatus(
                    updatedClass.getStatus()
            );
        }

        return classesRepository.save(existingClass);
    }

    public void deleteClass(Long id) {

        Classes classes = getClassById(id);

        classesRepository.delete(classes);
    }

    public long getStudentCount(Long classId) {

        getClassById(classId);

        return enrollmentRepository.countByClassId(classId);
    }

    public List<Enrollment> getEnrollmentsByClass(
            Long classId
    ) {

        getClassById(classId);

        return enrollmentRepository.findByClassId(classId);
    }
}