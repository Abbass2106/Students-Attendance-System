package com.example.student_attendance.services;

import com.example.student_attendance.models.Program;
import com.example.student_attendance.repositories.ProgramRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProgramService {

    private final ProgramRepository programRepository;

    public ProgramService(ProgramRepository programRepository) {
        this.programRepository = programRepository;
    }

    public Program createProgram(Program program) {

        if (programRepository.existsByCode(program.getCode())) {
            throw new RuntimeException("Program code already exists");
        }

        return programRepository.save(program);
    }

    public List<Program> getAllPrograms() {
        return programRepository.findAll();
    }

    public Program getProgramById(Long id) {

        return programRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Program not found"));
    }

    public Program getProgramByCode(String code) {

        return programRepository.findByCode(code)
                .orElseThrow(() ->
                        new RuntimeException("Program not found"));
    }

    public Program updateProgram(Long id, Program updatedProgram) {

        Program existingProgram = getProgramById(id);

        existingProgram.setCode(updatedProgram.getCode());
        existingProgram.setName(updatedProgram.getName());

        return programRepository.save(existingProgram);
    }

    public void deleteProgram(Long id) {

        Program program = getProgramById(id);

        programRepository.delete(program);
    }
}