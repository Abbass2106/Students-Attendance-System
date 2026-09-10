package com.example.student_attendance.models;

import java.util.List;

public class StudentsImportSummary {

    private int totalRows;
    private int createdCount;
    private int skippedCount;
    private List<StudentsImport> results;

    public StudentsImportSummary() {
    }

    public StudentsImportSummary(
            int totalRows,
            int createdCount,
            int skippedCount,
            List<StudentsImport> results
    ) {
        this.totalRows = totalRows;
        this.createdCount = createdCount;
        this.skippedCount = skippedCount;
        this.results = results;
    }

    public int getTotalRows() {
        return totalRows;
    }

    public void setTotalRows(int totalRows) {
        this.totalRows = totalRows;
    }

    public int getCreatedCount() {
        return createdCount;
    }

    public void setCreatedCount(int createdCount) {
        this.createdCount = createdCount;
    }

    public int getSkippedCount() {
        return skippedCount;
    }

    public void setSkippedCount(int skippedCount) {
        this.skippedCount = skippedCount;
    }

    public List<StudentsImport> getResults() {
        return results;
    }

    public void setResults(List<StudentsImport> results) {
        this.results = results;
    }
}