package com.example.student_attendance.services;

import com.example.student_attendance.Exceptions.ApiException;
import com.example.student_attendance.models.Attendance;
import com.example.student_attendance.models.AttendanceDtos.BulkRequest;
import com.example.student_attendance.models.AttendanceDtos.ClassInfo;
import com.example.student_attendance.models.AttendanceDtos.Entry;
import com.example.student_attendance.models.AttendanceDtos.Person;
import com.example.student_attendance.models.AttendanceDtos.RecordView;
import com.example.student_attendance.models.AttendanceSession;
import com.example.student_attendance.models.AttendanceStatus;
import com.example.student_attendance.models.AttendanceSummary;
import com.example.student_attendance.models.Classes;
import com.example.student_attendance.models.Enrollment;
import com.example.student_attendance.models.Role;
import com.example.student_attendance.models.Students;
import com.example.student_attendance.models.User;
import com.example.student_attendance.repositories.AttendanceRepository;
import com.example.student_attendance.repositories.AttendanceSessionRepository;
import com.example.student_attendance.repositories.ClassesRepository;
import com.example.student_attendance.repositories.EnrollmentRepository;
import com.example.student_attendance.repositories.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AttendanceSessionRepository sessionRepository;
    private final ClassesRepository classesRepository;
    private final StudentRepository studentRepository;

    public AttendanceService(
            AttendanceRepository attendanceRepository,
            EnrollmentRepository enrollmentRepository,
            AttendanceSessionRepository sessionRepository,
            ClassesRepository classesRepository,
            StudentRepository studentRepository
    ) {
        this.attendanceRepository = attendanceRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.sessionRepository = sessionRepository;
        this.classesRepository = classesRepository;
        this.studentRepository = studentRepository;
    }

    // ------------------------------------------------------------------
    // Access helpers: a TEACHER may only touch classes assigned to them.
    // ------------------------------------------------------------------

    private boolean isTeacher(User me) {
        return me != null && me.getRole() == Role.TEACHER;
    }

    private Classes getClass(Long classId) {
        return classesRepository.findById(classId)
                .orElseThrow(() -> new ApiException("Class not found", 404));
    }

    private void assertClassAccess(Classes cls, User me) {
        if (isTeacher(me) &&
                (cls.getLecturerId() == null || !cls.getLecturerId().equals(me.getId()))) {
            throw new ApiException("You are not assigned to this class", 403);
        }
    }

    public void assertSessionAccess(Long sessionId, User me) {
        AttendanceSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ApiException("Attendance session not found", 404));
        assertClassAccess(getClass(session.getClassId()), me);
    }

    public void assertEnrollmentAccess(Long enrollmentId, User me) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ApiException("Enrollment not found", 404));
        assertClassAccess(getClass(enrollment.getClassId()), me);
    }

    // ------------------------------------------------------------------
    // Single-record operations
    // ------------------------------------------------------------------

    public Attendance createAttendance(Long sessionId, Long enrollmentId, AttendanceStatus status) {
        return createAttendance(sessionId, enrollmentId, status, null);
    }

    public Attendance createAttendance(
            Long sessionId,
            Long enrollmentId,
            AttendanceStatus status,
            Long markedBy
    ) {

        AttendanceSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ApiException("Attendance session not found", 404));

        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ApiException("Enrollment not found", 404));

        if (enrollment.getClassId() == null ||
                !enrollment.getClassId().equals(session.getClassId())) {
            throw new ApiException("Enrollment does not belong to this class", 400);
        }

        if (status == null) {
            throw new ApiException("Attendance status is required", 400);
        }

        if (!"ACTIVE".equals(enrollment.getStatus())) {
            throw new ApiException("Student is no longer actively enrolled in this class", 400);
        }

        if (attendanceRepository.existsBySessionIdAndEnrollmentId(sessionId, enrollmentId)) {
            throw new ApiException("Attendance already exists for this student", 409);
        }

        Attendance attendance = new Attendance();
        attendance.setSessionId(sessionId);
        attendance.setEnrollmentId(enrollmentId);
        attendance.setStatus(status);
        attendance.setMarkedBy(markedBy);

        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getAttendanceBySession(Long sessionId) {

        if (!sessionRepository.existsById(sessionId)) {
            throw new ApiException("Attendance session not found", 404);
        }

        return attendanceRepository.findBySessionId(sessionId);
    }

    public List<Attendance> getAttendanceByEnrollment(Long enrollmentId) {

        if (!enrollmentRepository.existsById(enrollmentId)) {
            throw new ApiException("Enrollment not found", 404);
        }

        return attendanceRepository.findByEnrollmentId(enrollmentId);
    }

    public Attendance getAttendance(Long sessionId, Long enrollmentId) {

        return attendanceRepository
                .findBySessionIdAndEnrollmentId(sessionId, enrollmentId)
                .orElseThrow(() -> new ApiException("Attendance not found", 404));
    }

    public Attendance updateAttendance(Long sessionId, Long enrollmentId, AttendanceStatus status) {
        return updateAttendance(sessionId, enrollmentId, status, null);
    }

    public Attendance updateAttendance(
            Long sessionId,
            Long enrollmentId,
            AttendanceStatus status,
            Long markedBy
    ) {

        if (status == null) {
            throw new ApiException("Attendance status is required", 400);
        }

        Attendance attendance = getAttendance(sessionId, enrollmentId);

        attendance.setStatus(status);
        if (markedBy != null) {
            attendance.setMarkedBy(markedBy);
        }

        return attendanceRepository.save(attendance);
    }

    public void deleteAttendance(Long sessionId, Long enrollmentId) {
        attendanceRepository.delete(getAttendance(sessionId, enrollmentId));
    }

    public long countAttendanceByStatus(Long enrollmentId, AttendanceStatus status) {
        return attendanceRepository.countByEnrollmentIdAndStatus(enrollmentId, status);
    }

    // ------------------------------------------------------------------
    // Bulk marking: one call = "take the register for class X on date Y".
    // Finds (or creates) the session, then creates/updates one record per
    // enrolled student. Safe to call repeatedly to correct a register.
    // ------------------------------------------------------------------

    @Transactional
    public List<RecordView> markBulk(BulkRequest req, User me) {

        if (req == null || req.classId() == null || req.date() == null) {
            throw new ApiException("classId and date are required", 400);
        }

        if (req.records() == null || req.records().isEmpty()) {
            throw new ApiException("At least one attendance record is required", 400);
        }

        Classes cls = getClass(req.classId());
        assertClassAccess(cls, me);

        AttendanceSession session = sessionRepository
                .findByClassIdAndDate(cls.getId(), req.date())
                .stream()
                .findFirst()
                .orElseGet(() -> {
                    AttendanceSession created = new AttendanceSession();
                    created.setClassId(cls.getId());
                    created.setDate(req.date());
                    created.setTopic(req.topic());
                    created.setStartTime(req.startTime());
                    created.setEndTime(req.endTime());
                    created.setCreatedBy(me.getId());
                    return sessionRepository.save(created);
                });

        for (Entry entry : req.records()) {

            if (entry.enrollmentId() == null || entry.status() == null) {
                throw new ApiException("Each record needs an enrollmentId and a status", 400);
            }

            Enrollment enrollment = enrollmentRepository.findById(entry.enrollmentId())
                    .orElseThrow(() -> new ApiException(
                            "Enrollment " + entry.enrollmentId() + " not found", 404));

            if (!cls.getId().equals(enrollment.getClassId())) {
                throw new ApiException(
                        "Enrollment " + entry.enrollmentId() + " does not belong to this class", 400);
            }

            if (!"ACTIVE".equals(enrollment.getStatus())) {
                throw new ApiException(
                        "Enrollment " + entry.enrollmentId() + " is not active", 400);
            }

            Attendance attendance = attendanceRepository
                    .findBySessionIdAndEnrollmentId(session.getId(), enrollment.getId())
                    .orElseGet(Attendance::new);

            attendance.setSessionId(session.getId());
            attendance.setEnrollmentId(enrollment.getId());
            attendance.setStatus(entry.status());
            attendance.setMarkedBy(me.getId());
            attendance.setMarkedAt(LocalDateTime.now());

            attendanceRepository.save(attendance);
        }

        return toViews(attendanceRepository.findBySessionId(session.getId()));
    }

    // ------------------------------------------------------------------
    // Read models for the UI
    // ------------------------------------------------------------------

    // Existing records for a class on a date (used to pre-fill the register).
    public List<RecordView> getClassAttendanceForDate(Long classId, LocalDate date, User me) {

        assertClassAccess(getClass(classId), me);

        List<Long> sessionIds = sessionRepository.findByClassIdAndDate(classId, date)
                .stream().map(AttendanceSession::getId).toList();

        if (sessionIds.isEmpty()) {
            return List.of();
        }

        return toViews(attendanceRepository.findBySessionIdIn(sessionIds));
    }

    // All records for a date (dashboards). Teachers only see their own classes.
    public List<RecordView> getByDate(LocalDate date, User me) {

        List<Long> sessionIds = sessionRepository.findByDate(date)
                .stream().map(AttendanceSession::getId).toList();

        if (sessionIds.isEmpty()) {
            return List.of();
        }

        return filterForUser(toViews(attendanceRepository.findBySessionIdIn(sessionIds)), me);
    }

    // 50 most recently marked records (dashboard "recent attendance").
    public List<RecordView> getRecent(User me) {
        return filterForUser(toViews(attendanceRepository.findTop50ByOrderByMarkedAtDesc()), me);
    }

    private List<RecordView> filterForUser(List<RecordView> views, User me) {

        if (!isTeacher(me)) {
            return views;
        }

        Set<Long> myClassIds = classesRepository.findByLecturerId(me.getId())
                .stream().map(Classes::getId).collect(Collectors.toSet());

        return views.stream()
                .filter(v -> v.classes() != null && myClassIds.contains(v.classes().id()))
                .toList();
    }

    private List<RecordView> toViews(List<Attendance> records) {

        Map<Long, AttendanceSession> sessions = new HashMap<>();
        Map<Long, Enrollment> enrollments = new HashMap<>();
        Map<Long, Students> students = new HashMap<>();
        Map<Long, Classes> classes = new HashMap<>();

        List<RecordView> views = new ArrayList<>();

        for (Attendance a : records) {

            AttendanceSession session = sessions.computeIfAbsent(
                    a.getSessionId(), id -> sessionRepository.findById(id).orElse(null));
            Enrollment enrollment = enrollments.computeIfAbsent(
                    a.getEnrollmentId(), id -> enrollmentRepository.findById(id).orElse(null));

            if (session == null || enrollment == null) {
                continue;
            }

            Students student = students.computeIfAbsent(
                    enrollment.getStudentId(), id -> studentRepository.findById(id).orElse(null));
            Classes cls = classes.computeIfAbsent(
                    session.getClassId(), id -> classesRepository.findById(id).orElse(null));

            views.add(new RecordView(
                    a.getId(),
                    session.getId(),
                    enrollment.getId(),
                    session.getDate(),
                    a.getStatus(),
                    student == null ? null : new Person(
                            student.getId(), student.getStudentNumber(),
                            student.getFirstName(), student.getLastName()),
                    cls == null ? null : new ClassInfo(cls.getId(), cls.getCode(), cls.getCode())
            ));
        }

        return views;
    }

    // ------------------------------------------------------------------
    // Reports
    // ------------------------------------------------------------------

    public AttendanceSummary getStudentSummary(Long studentId, User me) {

        if (!studentRepository.existsById(studentId)) {
            throw new ApiException("Student not found", 404);
        }

        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(studentId);

        if (isTeacher(me)) {
            // A teacher's report only covers the classes they teach.
            enrollments = enrollments.stream()
                    .filter(e -> classesRepository.findById(e.getClassId())
                            .map(c -> me.getId().equals(c.getLecturerId()))
                            .orElse(false))
                    .toList();
        }

        return summarize(studentId, enrollments);
    }

    public AttendanceSummary getClassSummary(Long classId, User me) {

        Classes cls = getClass(classId);
        assertClassAccess(cls, me);

        return summarize(null, enrollmentRepository.findByClassId(classId));
    }

    private AttendanceSummary summarize(Long studentId, List<Enrollment> enrollments) {

        long present = 0, absent = 0, late = 0, excused = 0, total = 0;

        for (Enrollment e : enrollments) {
            present += attendanceRepository.countByEnrollmentIdAndStatus(e.getId(), AttendanceStatus.PRESENT);
            absent += attendanceRepository.countByEnrollmentIdAndStatus(e.getId(), AttendanceStatus.ABSENT);
            late += attendanceRepository.countByEnrollmentIdAndStatus(e.getId(), AttendanceStatus.LATE);
            excused += attendanceRepository.countByEnrollmentIdAndStatus(e.getId(), AttendanceStatus.EXCUSED);
            total += attendanceRepository.countByEnrollmentId(e.getId());
        }

        // Same rule as the student dashboard: only PRESENT counts as attended.
        double percentage = total == 0 ? 0 : Math.round((present * 10000.0) / total) / 100.0;

        return new AttendanceSummary(studentId, total, present, absent, late, excused, percentage);
    }
}