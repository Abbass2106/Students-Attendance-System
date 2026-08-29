package com.example.student_attendance.models;

public class AttendanceSummary {

    private Long studentId;
    private long totalDays;
    private long present;
    private long absent;
    private long late;
    private long excused;
    private double attendancePercentage;

    public AttendanceSummary() {
    }

    public AttendanceSummary(
            Long studentId,
            long totalDays,
            long present,
            long absent,
            long late,
            long excused,
            double attendancePercentage) {

        this.studentId = studentId;
        this.totalDays = totalDays;
        this.present = present;
        this.absent = absent;
        this.late = late;
        this.excused = excused;
        this.attendancePercentage = attendancePercentage;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public long getTotalDays() {
        return totalDays;
    }

    public void setTotalDays(long totalDays) {
        this.totalDays = totalDays;
    }

    public long getPresent() {
        return present;
    }

    public void setPresent(long present) {
        this.present = present;
    }

    public long getAbsent() {
        return absent;
    }

    public void setAbsent(long absent) {
        this.absent = absent;
    }

    public long getLate() {
        return late;
    }

    public void setLate(long late) {
        this.late = late;
    }

    public long getExcused() {
        return excused;
    }

    public void setExcused(long excused) {
        this.excused = excused;
    }

    public double getAttendancePercentage() {
        return attendancePercentage;
    }

    public void setAttendancePercentage(double attendancePercentage) {
        this.attendancePercentage = attendancePercentage;
    }
}