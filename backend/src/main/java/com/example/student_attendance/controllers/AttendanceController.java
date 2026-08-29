package com.example.student_attendance.controllers;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.student_attendance.models.AttendanceSummary;
import com.example.student_attendance.models.ClassAttendanceSummary;
import com.example.student_attendance.models.Attendance;
import com.example.student_attendance.services.AttendanceService;

import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    // create attendance
    @PostMapping
    public Attendance createAttendance(@Valid @RequestBody Attendance attendance) {
        return attendanceService.createAttendance(attendance);
    }

    // read attendance
    @GetMapping
    public List<Attendance> getAttendance() {
        return attendanceService.getAttendance();
    }

    // get attendance by id
    @GetMapping("/{id}")
    public Attendance getAttendanceById(@PathVariable Long id) {
        return attendanceService.getAttendanceById(id);
    }

    // get attendance by student
    @GetMapping("/student/{id}")
    public List<Attendance> getAttendanceByStudent(@PathVariable Long id) {
        return attendanceService.getAttendanceByStudent(id);
    }

    // get attendance by date
    @GetMapping("/date/{date}")
    public List<Attendance> getAttendanceByDate(@PathVariable LocalDate date) {
        return attendanceService.getAttendanceByDate(date);
    }

    // get attendance by class and date
    @GetMapping("/class/{classId}/date/{date}")
    public List<Attendance> getAttendanceByClassAndDate(@PathVariable Long classId, @PathVariable LocalDate date) {
        return attendanceService.getAttendanceByClassAndDate(classId, date);
    }

    // update attendance
    @PutMapping("/{id}")
    public Attendance updateAttendance(@Valid @RequestBody Attendance attendance, @PathVariable Long id) {
        return attendanceService.updateAttendance(attendance, id);
    }

    // delete attendance
    @DeleteMapping("/{id}")
    public void deleteAttendance(@PathVariable Long id) {
        attendanceService.deleteAttendance(id);
    }

    // get attendance by students
    @GetMapping("/student/{id}/summary")
    public AttendanceSummary getAttendanceSummary(@PathVariable Long id) {
        return attendanceService.getAttendanceSummary(id);
    }

    // get attendance summary by class
    @GetMapping("/class/{classId}/summary")
    public ClassAttendanceSummary getClassAttendanceSummary(
            @PathVariable Long classId) {

        return attendanceService.getClassAttendanceSummary(classId);
    }
}
