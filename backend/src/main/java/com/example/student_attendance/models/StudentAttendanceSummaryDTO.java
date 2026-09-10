package com.example.student_attendance.models;

// Summarised attendance for one enrollment (i.e. one class the student is
// taking), returned by GET /api/students/me/attendance. This is a read
// model composed from Enrollment + Attendance + Classes; it is not a
// persisted entity.
public class StudentAttendanceSummaryDTO {

    private Long enrollmentId;
    private Long classId;
    private String classCode;
    private long presentCount;
    private long absentCount;
    private long lateCount;
    private long excusedCount;
    private long totalSessions;
    private double attendancePercentage;

    public StudentAttendanceSummaryDTO() {
    }

    public Long getEnrollmentId() {
        return enrollmentId;
    }

    public void setEnrollmentId(Long enrollmentId) {
        this.enrollmentId = enrollmentId;
    }

    public Long getClassId() {
        return classId;
    }

    public void setClassId(Long classId) {
        this.classId = classId;
    }

    public String getClassCode() {
        return classCode;
    }

    public void setClassCode(String classCode) {
        this.classCode = classCode;
    }

    public long getPresentCount() {
        return presentCount;
    }

    public void setPresentCount(long presentCount) {
        this.presentCount = presentCount;
    }

    public long getAbsentCount() {
        return absentCount;
    }

    public void setAbsentCount(long absentCount) {
        this.absentCount = absentCount;
    }

    public long getLateCount() {
        return lateCount;
    }

    public void setLateCount(long lateCount) {
        this.lateCount = lateCount;
    }

    public long getExcusedCount() {
        return excusedCount;
    }

    public void setExcusedCount(long excusedCount) {
        this.excusedCount = excusedCount;
    }

    public long getTotalSessions() {
        return totalSessions;
    }

    public void setTotalSessions(long totalSessions) {
        this.totalSessions = totalSessions;
    }

    public double getAttendancePercentage() {
        return attendancePercentage;
    }

    public void setAttendancePercentage(double attendancePercentage) {
        this.attendancePercentage = attendancePercentage;
    }
}
