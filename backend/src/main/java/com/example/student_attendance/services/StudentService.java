package com.example.student_attendance.services;

import com.example.student_attendance.Exceptions.ApiException;
import com.example.student_attendance.models.AttendanceStatus;
import com.example.student_attendance.models.Classes;
import com.example.student_attendance.models.Enrollment;
import com.example.student_attendance.models.StudentAttendanceSummaryDTO;
import com.example.student_attendance.models.StudentsImport;
import com.example.student_attendance.models.StudentsImportSummary;
import com.example.student_attendance.models.Students;
import com.example.student_attendance.repositories.AttendanceRepository;
import com.example.student_attendance.repositories.ClassesRepository;
import com.example.student_attendance.repositories.EnrollmentRepository;
import com.example.student_attendance.repositories.ProgramRepository;
import com.example.student_attendance.repositories.StudentRepository;
import com.example.student_attendance.util.CsvUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final ClassesRepository classesRepository;
    private final ProgramRepository programRepository;

    // Header names we recognize in an import CSV, mapped to how we compare
    // them (lower-cased, punctuation-insensitive) so "Student Number",
    // "student_number" and "studentNumber" all resolve the same way.
    private static final Set<String> REQUIRED_HEADERS = Set.of(
            "studentnumber", "firstname", "lastname", "email"
    );

    public StudentService(
            StudentRepository studentRepository,
            EnrollmentRepository enrollmentRepository,
            AttendanceRepository attendanceRepository,
            ClassesRepository classesRepository,
            ProgramRepository programRepository
    ) {
        this.studentRepository = studentRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.attendanceRepository = attendanceRepository;
        this.classesRepository = classesRepository;
        this.programRepository = programRepository;
    }

    public Students createStudent(Students student) {

        if (studentRepository.existsByStudentNumber(
                student.getStudentNumber())) {

            throw new ApiException(
                    "Student number already exists",
                    409
            );
        }

        if (studentRepository.existsByEmail(
                student.getEmail())) {

            throw new ApiException(
                    "Email already exists",
                    409
            );
        }

        if (student.getStatus() == null ||
                student.getStatus().isBlank()) {

            student.setStatus("ACTIVE");
        }

        return studentRepository.save(student);
    }

    // Bulk-creates students from an uploaded CSV. Required columns:
    // studentNumber, firstName, lastName, email. Optional: phone,
    // programId, year, semester, status. Column order doesn't matter and
    // headers are matched case/punctuation-insensitively.
    //
    // Each row is validated and saved independently so one bad row (a
    // duplicate, a missing field, a bad programId) is reported and
    // skipped rather than failing the whole file. Duplicates *within*
    // the file are also caught, not just duplicates against the DB.
    public StudentsImportSummary importStudents(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new ApiException("CSV file is required", 400);
        }

        List<String> lines;

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(
                        file.getInputStream(),
                        StandardCharsets.UTF_8
                )
        )) {

            lines = reader.lines()
                    .filter(line -> !line.isBlank())
                    .toList();

        } catch (IOException e) {
            throw new ApiException("Unable to read CSV file", 400);
        }

        if (lines.isEmpty()) {
            throw new ApiException("CSV file is empty", 400);
        }

        List<String> headerRow = CsvUtils.parseLine(lines.get(0));
        Map<String, Integer> columnIndex = new HashMap<>();

        for (int i = 0; i < headerRow.size(); i++) {
            columnIndex.put(normalizeHeader(headerRow.get(i)), i);
        }

        List<String> missingHeaders = new ArrayList<>();
        for (String required : REQUIRED_HEADERS) {
            if (!columnIndex.containsKey(required)) {
                missingHeaders.add(required);
            }
        }

        if (!missingHeaders.isEmpty()) {
            throw new ApiException(
                    "CSV is missing required column(s): " +
                            String.join(", ", missingHeaders) +
                            ". Expected headers: studentNumber, firstName, " +
                            "lastName, email (plus optional phone, " +
                            "programId, year, semester, status).",
                    400
            );
        }

        List<StudentsImport> results = new ArrayList<>();
        Set<String> seenNumbersInFile = new HashSet<>();
        Set<String> seenEmailsInFile = new HashSet<>();
        int createdCount = 0;
        int skippedCount = 0;

        for (int lineIdx = 1; lineIdx < lines.size(); lineIdx++) {

            int rowNumber = lineIdx + 1; // 1-based, includes header row
            List<String> fields = CsvUtils.parseLine(lines.get(lineIdx));

            String studentNumber = valueOf(fields, columnIndex, "studentnumber");
            String firstName = valueOf(fields, columnIndex, "firstname");
            String lastName = valueOf(fields, columnIndex, "lastname");
            String email = valueOf(fields, columnIndex, "email");
            String phone = valueOf(fields, columnIndex, "phone");
            String programIdRaw = valueOf(fields, columnIndex, "programid");
            String yearRaw = valueOf(fields, columnIndex, "year");
            String semesterRaw = valueOf(fields, columnIndex, "semester");
            String status = valueOf(fields, columnIndex, "status");

            try {
                if (isBlank(studentNumber) || isBlank(firstName) ||
                        isBlank(lastName) || isBlank(email)) {

                    throw new ApiException(
                            "Missing required field(s) " +
                                    "(studentNumber, firstName, lastName, email)",
                            400
                    );
                }

                if (!seenNumbersInFile.add(studentNumber)) {
                    throw new ApiException(
                            "Duplicate studentNumber earlier in this file",
                            409
                    );
                }

                if (!seenEmailsInFile.add(email.toLowerCase())) {
                    throw new ApiException(
                            "Duplicate email earlier in this file",
                            409
                    );
                }

                if (studentRepository.existsByStudentNumber(studentNumber)) {
                    throw new ApiException(
                            "Student number already exists",
                            409
                    );
                }

                if (studentRepository.existsByEmail(email)) {
                    throw new ApiException(
                            "Email already exists",
                            409
                    );
                }

                Students student = new Students();
                student.setStudentNumber(studentNumber);
                student.setFirstName(firstName);
                student.setLastName(lastName);
                student.setEmail(email);
                student.setPhone(isBlank(phone) ? null : phone);
                student.setStatus(isBlank(status) ? "ACTIVE" : status);

                if (!isBlank(programIdRaw)) {
                    Long programId = parseLong(
                            programIdRaw,
                            "programId"
                    );

                    if (!programRepository.existsById(programId)) {
                        throw new ApiException(
                                "programId " + programId + " does not exist",
                                400
                        );
                    }

                    student.setProgramId(programId);
                }

                if (!isBlank(yearRaw)) {
                    student.setYear(
                            (int) parseLong(yearRaw, "year")
                    );
                }

                if (!isBlank(semesterRaw)) {
                    student.setSemester(
                            (int) parseLong(semesterRaw, "semester")
                    );
                }

                studentRepository.save(student);

                results.add(new StudentsImport(
                        rowNumber,
                        studentNumber,
                        "CREATED",
                        "Student created"
                ));

                createdCount++;

            } catch (ApiException e) {

                results.add(new StudentsImport(
                        rowNumber,
                        studentNumber,
                        "SKIPPED",
                        e.getMessage()
                ));

                skippedCount++;
            }
        }

        return new StudentsImportSummary(
                lines.size() - 1,
                createdCount,
                skippedCount,
                results
        );
    }

    private String normalizeHeader(String header) {
        return header == null
                ? ""
                : header.trim().toLowerCase().replaceAll("[^a-z0-9]", "");
    }

    private String valueOf(
            List<String> fields,
            Map<String, Integer> columnIndex,
            String normalizedHeader
    ) {
        Integer idx = columnIndex.get(normalizedHeader);

        if (idx == null || idx >= fields.size()) {
            return null;
        }

        String value = fields.get(idx);
        return value == null ? null : value.trim();
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private long parseLong(String value, String fieldName) {
        try {
            return Long.parseLong(value.trim());
        } catch (NumberFormatException e) {
            throw new ApiException(
                    "Invalid numeric value for " + fieldName + ": " + value,
                    400
            );
        }
    }

    public List<Students> getAllStudents() {
        return studentRepository.findAll();
    }

    public Students getStudentById(Long id) {

        return studentRepository.findById(id)
                .orElseThrow(() ->
                        new ApiException(
                                "Student not found with id: " + id,
                                404
                        ));
    }

    public Students getStudentByNumber(String studentNumber) {

        return studentRepository
                .findByStudentNumber(studentNumber)
                .orElseThrow(() ->
                        new ApiException(
                                "Student not found with number: "
                                        + studentNumber,
                                404
                        ));
    }

    // Resolves the Students profile linked to a logged-in STUDENT user by
    // matching the User's email to Students.email. There is no formal
    // foreign key between User and Students yet, so this convention is
    // what powers the /me endpoints below.
    public Students getStudentByEmail(String email) {

        return studentRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ApiException(
                                "No student profile is linked to this account yet. " +
                                        "Ask an administrator to create one using this email.",
                                404
                        ));
    }

    public List<Enrollment> getMyEnrollments(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId);
    }

    // Builds a per-class attendance summary (counts + percentage) for the
    // given student, based on their enrollments and recorded attendance.
    public List<StudentAttendanceSummaryDTO> getAttendanceSummary(
            Long studentId
    ) {

        List<Enrollment> enrollments =
                enrollmentRepository.findByStudentId(studentId);

        List<StudentAttendanceSummaryDTO> summaries =
                new ArrayList<>();

        for (Enrollment enrollment : enrollments) {

            long present = attendanceRepository
                    .countByEnrollmentIdAndStatus(
                            enrollment.getId(),
                            AttendanceStatus.PRESENT
                    );

            long absent = attendanceRepository
                    .countByEnrollmentIdAndStatus(
                            enrollment.getId(),
                            AttendanceStatus.ABSENT
                    );

            long late = attendanceRepository
                    .countByEnrollmentIdAndStatus(
                            enrollment.getId(),
                            AttendanceStatus.LATE
                    );

            long excused = attendanceRepository
                    .countByEnrollmentIdAndStatus(
                            enrollment.getId(),
                            AttendanceStatus.EXCUSED
                    );

            long total = attendanceRepository
                    .countByEnrollmentId(enrollment.getId());

            double percentage = total == 0
                    ? 0
                    : Math.round((present * 10000.0) / total) / 100.0;

            Classes classes = classesRepository
                    .findById(enrollment.getClassId())
                    .orElse(null);

            StudentAttendanceSummaryDTO summary =
                    new StudentAttendanceSummaryDTO();

            summary.setEnrollmentId(enrollment.getId());
            summary.setClassId(enrollment.getClassId());
            summary.setClassCode(
                    classes != null ? classes.getCode() : null
            );
            summary.setPresentCount(present);
            summary.setAbsentCount(absent);
            summary.setLateCount(late);
            summary.setExcusedCount(excused);
            summary.setTotalSessions(total);
            summary.setAttendancePercentage(percentage);

            summaries.add(summary);
        }

        return summaries;
    }

    public Students updateStudent(
            Long id,
            Students updatedStudent
    ) {

        Students existingStudent = getStudentById(id);

        if (studentRepository.existsByStudentNumberAndIdNot(
                updatedStudent.getStudentNumber(),
                id)) {

            throw new ApiException(
                    "Student number already exists",
                    409
            );
        }

        if (studentRepository.existsByEmailAndIdNot(
                updatedStudent.getEmail(),
                id)) {

            throw new ApiException(
                    "Email already exists",
                    409
            );
        }

        existingStudent.setStudentNumber(
                updatedStudent.getStudentNumber()
        );

        existingStudent.setFirstName(
                updatedStudent.getFirstName()
        );

        existingStudent.setLastName(
                updatedStudent.getLastName()
        );

        existingStudent.setEmail(
                updatedStudent.getEmail()
        );

        existingStudent.setPhone(
                updatedStudent.getPhone()
        );

        existingStudent.setProgramId(
                updatedStudent.getProgramId()
        );

        existingStudent.setYear(
                updatedStudent.getYear()
        );

        existingStudent.setSemester(
                updatedStudent.getSemester()
        );

        if (updatedStudent.getStatus() != null &&
                !updatedStudent.getStatus().isBlank()) {

            existingStudent.setStatus(
                    updatedStudent.getStatus()
            );
        }

        return studentRepository.save(existingStudent);
    }

    public void deleteStudent(Long id) {

        Students student = getStudentById(id);

        studentRepository.delete(student);
    }
}