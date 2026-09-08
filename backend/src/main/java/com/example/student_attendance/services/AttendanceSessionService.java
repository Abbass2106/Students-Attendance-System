package com.example.student_attendance.services;

import com.example.student_attendance.models.AttendanceSession;
import com.example.student_attendance.repositories.AttendanceSessionRepository;
import com.example.student_attendance.repositories.ClassesRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AttendanceSessionService {

    private final AttendanceSessionRepository sessionRepository;
    private final ClassesRepository classesRepository;

    public AttendanceSessionService(
            AttendanceSessionRepository sessionRepository,
            ClassesRepository classesRepository
    ) {
        this.sessionRepository = sessionRepository;
        this.classesRepository = classesRepository;
    }

    public AttendanceSession createSession(
            AttendanceSession session,
            Long classId
    ) {

        classesRepository.findById(classId)
                .orElseThrow(() ->
                        new RuntimeException("Class not found"));

        session.setClassId(classId);

        return sessionRepository.save(session);
    }

    public List<AttendanceSession> getAllSessions() {
        return sessionRepository.findAll();
    }

    public AttendanceSession getSessionById(Long id) {

        return sessionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Attendance session not found"));
    }

    public List<AttendanceSession> getSessionsByClass(Long classId) {

        if (!classesRepository.existsById(classId)) {
            throw new RuntimeException("Class not found");
        }

        return sessionRepository.findByClassId(classId);
    }

    public List<AttendanceSession> getSessionsByDate(LocalDate date) {

        return sessionRepository.findByDate(date);
    }

    public List<AttendanceSession> getSessionsByClassAndDate(
            Long classId,
            LocalDate date
    ) {

        if (!classesRepository.existsById(classId)) {
            throw new RuntimeException("Class not found");
        }

        return sessionRepository.findByClassIdAndDate(
                classId,
                date
        );
    }

    public void deleteSession(Long id) {

        AttendanceSession session = getSessionById(id);

        sessionRepository.delete(session);
    }
}