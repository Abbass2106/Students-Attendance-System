package com.example.student_attendance.services;

import com.example.student_attendance.models.Attendance;
import com.example.student_attendance.models.AttendanceStatus;
import com.example.student_attendance.models.AttendanceSummary;
import com.example.student_attendance.models.ClassAttendanceSummary;
import com.example.student_attendance.models.Classes;
import com.example.student_attendance.models.Students;
import com.example.student_attendance.repositories.AttendanceRepository;
import com.example.student_attendance.repositories.ClassRepository;
import com.example.student_attendance.repositories.StudentRepository;

import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;

import com.example.student_attendance.Exceptions.ApiException;

@Service
public class AttendanceService {

    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;
    private final ClassRepository classRepository;

    public AttendanceService(AttendanceRepository attendanceRepository, StudentRepository studentRepository,
            ClassRepository classRepository) {
        this.studentRepository = studentRepository;
        this.attendanceRepository = attendanceRepository;
        this.classRepository = classRepository;
    }

    // create attendance
    public Attendance createAttendance(Attendance attendance) {
        Long studentId = attendance.getStudents().getId();
        Students students = studentRepository.findById(studentId).orElse(null);

        if (students == null) {
            throw new ApiException("Student not found", 404);
        }

        Long classId = attendance.getClasses() != null ? attendance.getClasses().getId()
                : students.getClasses() != null ? students.getClasses().getId() : null;
        Classes classes = classId == null ? null : classRepository.findById(classId).orElse(null);

        if (classes == null) {
            throw new ApiException("Class not found", 404);
        }

        boolean existingStudent = attendanceRepository.existsByStudentsIdAndDateAndClassesId(
                studentId, attendance.getDate(), classId);
        if (existingStudent) {
            throw new ApiException("Student already signed in", 409);
        }

        attendance.setStudents(students);
        attendance.setClasses(classes);
        return attendanceRepository.save(attendance);
    }

    // read attendance
    public List<Attendance> getAttendance() {
        return attendanceRepository.findAll();
    }

    // get attendance by id
    public Attendance getAttendanceById(Long id) {
        Attendance attendance = attendanceRepository.findById(id).orElse(null);

        if (attendance == null) {
            throw new ApiException("Attendance not available", 404);
        }

        return attendance;
    }

    // get students Attendance by id
    public List<Attendance> getAttendanceByStudent(Long studentId) {
        return attendanceRepository.findStudentsById(studentId);
    }

    // get students attendance by date
    public List<Attendance> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByDate(date);
    }

    // get students attendance by class and date
    public List<Attendance> getAttendanceByClassAndDate(Long classId, LocalDate date) {
        return attendanceRepository.findByClassesIdAndDate(classId, date);
    }

    // update attendance
    public Attendance updateAttendance(Attendance attendance, Long id) {
        Attendance existingAttendance = attendanceRepository.findById(id).orElse(null);

        if (existingAttendance == null) {
            throw new ApiException("Attendance not found", 404);
        }

        existingAttendance.setDate(attendance.getDate());
        existingAttendance.setStatus(attendance.getStatus());

        return attendanceRepository.save(existingAttendance);
    }

    // delete attendance
    public void deleteAttendance(Long id) {
        attendanceRepository.deleteById(id);
    }

    // get attendance summary by student
    public AttendanceSummary getAttendanceSummary(Long studentId) {

        // make sure student exists
        Students student = studentRepository.findById(studentId).orElse(null);

        if (student == null) {
            throw new ApiException("Student not found", 409);
        }

        // count attendance records
        long totalDays = attendanceRepository.countByStudentsId(studentId);

        long present = attendanceRepository.countByStudentsIdAndStatus(
                studentId,
                AttendanceStatus.PRESENT);

        long absent = attendanceRepository.countByStudentsIdAndStatus(
                studentId,
                AttendanceStatus.ABSENT);

        long late = attendanceRepository.countByStudentsIdAndStatus(
                studentId,
                AttendanceStatus.LATE);

        long excused = attendanceRepository.countByStudentsIdAndStatus(
                studentId,
                AttendanceStatus.EXCUSED);

        // calculate percentage
        double attendancePercentage = 0;

        if (totalDays > 0) {
            attendancePercentage = ((double) (present + late) / totalDays) * 100;
        }

        return new AttendanceSummary(
                studentId,
                totalDays,
                present,
                absent,
                late,
                excused,
                attendancePercentage);
    }

    // get attendance summary by class
    public ClassAttendanceSummary getClassAttendanceSummary(Long classId) {

        // count all attendance records for this class
        long totalRecords = attendanceRepository.countByClassesId(classId);

        long present = attendanceRepository.countByClassesIdAndStatus(
                classId,
                AttendanceStatus.PRESENT);

        long absent = attendanceRepository.countByClassesIdAndStatus(
                classId,
                AttendanceStatus.ABSENT);

        long late = attendanceRepository.countByClassesIdAndStatus(
                classId,
                AttendanceStatus.LATE);

        long excused = attendanceRepository.countByClassesIdAndStatus(
                classId,
                AttendanceStatus.EXCUSED);

        // calculate percentage
        double attendancePercentage = 0;

        if (totalRecords > 0) {
            attendancePercentage = ((double) (present + late) / totalRecords) * 100;
        }

        return new ClassAttendanceSummary(
                classId,
                totalRecords,
                present,
                absent,
                late,
                excused,
                attendancePercentage);
    }
}
