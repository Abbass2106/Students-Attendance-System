package com.example.student_attendance.models;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

// Request/response shapes for the attendance API (not persisted).
public final class AttendanceDtos {

    private AttendanceDtos() {
    }

    // POST /api/attendance/bulk
    public record BulkRequest(
            Long classId,
            LocalDate date,
            String topic,
            LocalTime startTime,
            LocalTime endTime,
            List<Entry> records
    ) {
    }

    public record Entry(Long enrollmentId, AttendanceStatus status) {
    }

    // Field names "students" / "classes" are deliberate: the existing admin and
    // teacher dashboards already read item.students.firstName and item.classes.name.
    public record RecordView(
            Long id,
            Long sessionId,
            Long enrollmentId,
            LocalDate date,
            AttendanceStatus status,
            Person students,
            ClassInfo classes
    ) {
    }

    public record Person(Long id, String studentNumber, String firstName, String lastName) {
    }

    public record ClassInfo(Long id, String code, String name) {
    }
}