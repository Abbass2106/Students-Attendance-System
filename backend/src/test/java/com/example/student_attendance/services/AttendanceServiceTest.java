package com.example.student_attendance.services;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.student_attendance.Exceptions.ApiException;
import com.example.student_attendance.models.Attendance;
import com.example.student_attendance.models.Classes;
import com.example.student_attendance.models.Students;
import com.example.student_attendance.repositories.AttendanceRepository;
import com.example.student_attendance.repositories.ClassRepository;
import com.example.student_attendance.repositories.StudentRepository;

@ExtendWith(MockitoExtension.class)
class AttendanceServiceTest {

    @Mock
    private AttendanceRepository attendanceRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private ClassRepository classRepository;

    @InjectMocks
    private AttendanceService attendanceService;

    @Test
    void createAttendance_rejects_duplicate_for_the_same_student_date_and_class() {
        LocalDate date = LocalDate.of(2026, 9, 1);
        Students student = student(10L);
        Classes schoolClass = schoolClass(20L);
        Attendance attendance = attendance(student, schoolClass, date);

        when(studentRepository.findById(10L)).thenReturn(Optional.of(student));
        when(classRepository.findById(20L)).thenReturn(Optional.of(schoolClass));
        when(attendanceRepository.existsByStudentsIdAndDateAndClassesId(10L, date, 20L)).thenReturn(true);

        assertThrows(ApiException.class, () -> attendanceService.createAttendance(attendance));

        verify(attendanceRepository).existsByStudentsIdAndDateAndClassesId(eq(10L), eq(date), eq(20L));
    }

    private Attendance attendance(Students student, Classes schoolClass, LocalDate date) {
        Attendance attendance = new Attendance();
        attendance.setStudents(student);
        attendance.setClasses(schoolClass);
        attendance.setDate(date);
        return attendance;
    }

    private Students student(Long id) {
        Students student = new Students();
        student.setId(id);
        return student;
    }

    private Classes schoolClass(Long id) {
        Classes schoolClass = new Classes();
        schoolClass.setId(id);
        return schoolClass;
    }
}
