package com.example.student_attendance.services;

import com.example.student_attendance.Exceptions.ApiException;
import com.example.student_attendance.models.Classes;
import com.example.student_attendance.models.Enrollment;
import com.example.student_attendance.models.Role;
import com.example.student_attendance.models.User;
import com.example.student_attendance.repositories.ClassesRepository;
import com.example.student_attendance.repositories.CoursesRepository;
import com.example.student_attendance.repositories.EnrollmentRepository;
import com.example.student_attendance.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClassesService {

        private final ClassesRepository classesRepository;
        private final CoursesRepository coursesRepository;
        private final EnrollmentRepository enrollmentRepository;
        private final UserRepository userRepository;

        public ClassesService(
                        ClassesRepository classesRepository,
                        CoursesRepository coursesRepository,
                        EnrollmentRepository enrollmentRepository,
                        UserRepository userRepository) {
                this.classesRepository = classesRepository;
                this.coursesRepository = coursesRepository;
                this.enrollmentRepository = enrollmentRepository;
                this.userRepository = userRepository;
        }

        public Classes createClass(Classes classes) {

                if (classesRepository.existsByCode(classes.getCode())) {
                        throw new ApiException(
                                        "Class code already exists",
                                        409);
                }

                if (!coursesRepository.existsById(
                                classes.getCourseId())) {

                        throw new ApiException(
                                        "Course not found",
                                        404);
                }

                /*
                 * If a lecturerId is supplied while creating the class,
                 * make sure that user actually exists and is a TEACHER.
                 */
                if (classes.getLecturerId() != null) {

                        validateTeacher(classes.getLecturerId());
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

        /*
         * Returns only classes assigned to the specified teacher.
         */
        public List<Classes> getMyClasses(Long lecturerId) {

                return classesRepository.findByLecturerId(lecturerId);
        }

        public Classes getClassById(Long id) {

                return classesRepository.findById(id)
                                .orElseThrow(() -> new ApiException(
                                                "Class not found",
                                                404));
        }

        public Classes getClassByCode(String code) {

                return classesRepository.findByCode(code)
                                .orElseThrow(() -> new ApiException(
                                                "Class not found",
                                                404));
        }

        /*
         * Updates the class information.
         *
         * IMPORTANT:
         * lecturerId is NOT changed here.
         *
         * Teacher assignment is handled separately through:
         *
         * PUT /api/classes/{classId}/teacher/{teacherId}
         */
        public Classes updateClass(
                        Long id,
                        Classes updatedClass) {

                Classes existingClass = getClassById(id);

                if (classesRepository.existsByCodeAndIdNot(
                                updatedClass.getCode(),
                                id)) {

                        throw new ApiException(
                                        "Class code already exists",
                                        409);
                }

                if (!coursesRepository.existsById(
                                updatedClass.getCourseId())) {

                        throw new ApiException(
                                        "Course not found",
                                        404);
                }

                existingClass.setCode(
                                updatedClass.getCode());

                existingClass.setCourseId(
                                updatedClass.getCourseId());

                existingClass.setSemester(
                                updatedClass.getSemester());

                existingClass.setAcademicYear(
                                updatedClass.getAcademicYear());

                /*
                 * Do NOT update lecturerId here.
                 *
                 * Teacher assignment has its own endpoint.
                 */

                existingClass.setRoom(
                                updatedClass.getRoom());

                existingClass.setCapacity(
                                updatedClass.getCapacity());

                if (updatedClass.getStatus() != null &&
                                !updatedClass.getStatus().isBlank()) {

                        existingClass.setStatus(
                                        updatedClass.getStatus());
                }

                return classesRepository.save(existingClass);
        }

        /*
         * Assigns a TEACHER to a class.
         *
         * classId = Classes.id
         * teacherId = User.id
         */
        public Classes assignTeacher(
                        Long classId,
                        Long teacherId) {

                // 1. Make sure the class exists
                Classes classes = getClassById(classId);

                // 2. Make sure the user exists and is a TEACHER
                validateTeacher(teacherId);

                // 3. Assign the teacher
                classes.setLecturerId(teacherId);

                // 4. Save the class
                return classesRepository.save(classes);
        }

        /*
         * Removes the teacher assigned to a class.
         */
        public Classes removeTeacher(Long classId) {

                Classes classes = getClassById(classId);

                classes.setLecturerId(null);

                return classesRepository.save(classes);
        }

        /*
         * Verifies that the specified user exists
         * and has the TEACHER role.
         */
        private User validateTeacher(Long teacherId) {

                User teacher = userRepository.findById(teacherId)
                                .orElseThrow(() -> new ApiException(
                                                "Teacher not found",
                                                404));

                if (teacher.getRole() != Role.TEACHER) {

                        throw new ApiException(
                                        "User is not a TEACHER",
                                        400);
                }

                return teacher;
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
                        Long classId) {

                getClassById(classId);

                return enrollmentRepository.findByClassId(classId);
        }

        public Classes getClassByIdForTeacher(
                        Long classId,
                        Long teacherId) {
                Classes classes = getClassById(classId);

                if (classes.getLecturerId() == null ||
                                !classes.getLecturerId().equals(teacherId)) {

                        throw new ApiException(
                                        "You are not assigned to this class",
                                        403);
                }

                return classes;
        }
}