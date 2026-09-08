package com.example.student_attendance.services;

import com.example.student_attendance.Exceptions.ApiException;
import com.example.student_attendance.models.Program;
import com.example.student_attendance.repositories.DepartmentRepository;
import com.example.student_attendance.repositories.ProgramRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProgramService {

    private final ProgramRepository programRepository;
    private final DepartmentRepository departmentRepository;

    public ProgramService(
            ProgramRepository programRepository,
            DepartmentRepository departmentRepository
    ) {
        this.programRepository = programRepository;
        this.departmentRepository = departmentRepository;
    }

    public Program createProgram(Program program) {

        if (programRepository.existsByCode(
                program.getCode())) {

            throw new ApiException(
                    "Program code already exists",
                    409
            );
        }

        if (!departmentRepository.existsById(
                program.getDepartmentId())) {

            throw new ApiException(
                    "Department not found",
                    404
            );
        }

        return programRepository.save(program);
    }

    public List<Program> getAllPrograms() {
        return programRepository.findAll();
    }

    public Program getProgramById(Long id) {

        return programRepository.findById(id)
                .orElseThrow(() ->
                        new ApiException(
                                "Program not found",
                                404
                        ));
    }

    public Program getProgramByCode(String code) {

        return programRepository.findByCode(code)
                .orElseThrow(() ->
                        new ApiException(
                                "Program not found",
                                404
                        ));
    }

    public Program updateProgram(
            Long id,
            Program updatedProgram
    ) {

        Program existing =
                getProgramById(id);

        if (!existing.getCode()
                .equals(updatedProgram.getCode()) &&
                programRepository.existsByCode(
                        updatedProgram.getCode())) {

            throw new ApiException(
                    "Program code already exists",
                    409
            );
        }

        if (!departmentRepository.existsById(
                updatedProgram.getDepartmentId())) {

            throw new ApiException(
                    "Department not found",
                    404
            );
        }

        existing.setCode(updatedProgram.getCode());
        existing.setName(updatedProgram.getName());
        existing.setDepartmentId(
                updatedProgram.getDepartmentId()
        );

        return programRepository.save(existing);
    }

    public void deleteProgram(Long id) {

        Program program =
                getProgramById(id);

        programRepository.delete(program);
    }
}