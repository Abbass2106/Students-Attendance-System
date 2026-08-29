package com.example.student_attendance.models;

public class ClassAttendanceSummary {

    private Long classId;
    private long totalRecords;
    private long present;
    private long absent;
    private long late;
    private long excused;
    private double attendancePercentage;

    public ClassAttendanceSummary() {
    }

    public ClassAttendanceSummary(
            Long classId,
            long totalRecords,
            long present,
            long absent,
            long late,
            long excused,
            double attendancePercentage) {

        this.classId = classId;
        this.totalRecords = totalRecords;
        this.present = present;
        this.absent = absent;
        this.late = late;
        this.excused = excused;
        this.attendancePercentage = attendancePercentage;
    }

    public Long getClassId() {
        return classId;
    }

    public void setClassId(Long classId) {
        this.classId = classId;
    }

    public long getTotalRecords() {
        return totalRecords;
    }

    public void setTotalRecords(long totalRecords) {
        this.totalRecords = totalRecords;
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