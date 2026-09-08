package com.example.student_attendance.services;

import com.example.student_attendance.Exceptions.ApiException;
import com.example.student_attendance.models.Department;
import com.example.student_attendance.repositories.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(
            DepartmentRepository departmentRepository
    ) {
        this.departmentRepository = departmentRepository;
    }

    public Department createDepartment(
            Department department
    ) {

        if (departmentRepository.existsByCode(
                department.getCode())) {

            throw new ApiException(
                    "Department code already exists",
                    409
            );
        }

        return departmentRepository.save(department);
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Department getDepartmentById(Long id) {

        return departmentRepository.findById(id)
                .orElseThrow(() ->
                        new ApiException(
                                "Department not found",
                                404
                        ));
    }

    public Department getDepartmentByCode(String code) {

        return departmentRepository.findByCode(code)
                .orElseThrow(() ->
                        new ApiException(
                                "Department not found",
                                404
                        ));
    }

    public Department updateDepartment(
            Long id,
            Department updatedDepartment
    ) {

        Department existing =
                getDepartmentById(id);

        if (!existing.getCode()
                .equals(updatedDepartment.getCode()) &&
                departmentRepository.existsByCode(
                        updatedDepartment.getCode())) {

            throw new ApiException(
                    "Department code already exists",
                    409
            );
        }

        existing.setCode(updatedDepartment.getCode());
        existing.setName(updatedDepartment.getName());

        return departmentRepository.save(existing);
    }

    public void deleteDepartment(Long id) {

        Department department =
                getDepartmentById(id);

        departmentRepository.delete(department);
    }
}