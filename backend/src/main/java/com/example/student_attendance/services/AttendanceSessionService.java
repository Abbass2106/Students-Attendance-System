package com.example.student_attendance.services;

import com.example.student_attendance.Exceptions.ApiException;
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

        if (!classesRepository.existsById(classId)) {
            throw new ApiException(
                    "Class not found",
                    404
            );
        }

        if (session.getDate() == null) {
            throw new ApiException(
                    "Session date is required",
                    400
            );
        }

        if (session.getStartTime() != null &&
                session.getEndTime() != null &&
                !session.getEndTime()
                        .isAfter(session.getStartTime())) {

            throw new ApiException(
                    "End time must be after start time",
                    400
            );
        }

        session.setClassId(classId);

        return sessionRepository.save(session);
    }

    public List<AttendanceSession> getAllSessions() {
        return sessionRepository.findAll();
    }

    public AttendanceSession getSessionById(Long id) {

        return sessionRepository.findById(id)
                .orElseThrow(() ->
                        new ApiException(
                                "Attendance session not found",
                                404
                        ));
    }

    public List<AttendanceSession> getSessionsByClass(
            Long classId
    ) {

        if (!classesRepository.existsById(classId)) {
            throw new ApiException(
                    "Class not found",
                    404
            );
        }

        return sessionRepository.findByClassId(classId);
    }

    public List<AttendanceSession> getSessionsByDate(
            LocalDate date
    ) {

        return sessionRepository.findByDate(date);
    }

    public List<AttendanceSession> getSessionsByClassAndDate(
            Long classId,
            LocalDate date
    ) {

        if (!classesRepository.existsById(classId)) {
            throw new ApiException(
                    "Class not found",
                    404
            );
        }

        return sessionRepository.findByClassIdAndDate(
                classId,
                date
        );
    }

    public void deleteSession(Long id) {

        AttendanceSession session =
                getSessionById(id);

        sessionRepository.delete(session);
    }
}