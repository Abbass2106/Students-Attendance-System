package com.example.student_attendance.models;

public class StudentsImport {

    private int row;
    private String studentNumber;
    private String status; // CREATED | SKIPPED
    private String message;

    public StudentsImport() {
    }

    public StudentsImport(
            int row,
            String studentNumber,
            String status,
            String message
    ) {
        this.row = row;
        this.studentNumber = studentNumber;
        this.status = status;
        this.message = message;
    }

    public int getRow() {
        return row;
    }

    public void setRow(int row) {
        this.row = row;
    }

    public String getStudentNumber() {
        return studentNumber;
    }

    public void setStudentNumber(String studentNumber) {
        this.studentNumber = studentNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}