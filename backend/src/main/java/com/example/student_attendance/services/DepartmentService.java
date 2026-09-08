package com.example.student_attendance.services;

import com.example.student_attendance.models.Department;
import com.example.student_attendance.repositories.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public Department createDepartment(Department department) {

        if (departmentRepository.existsByCode(department.getCode())) {
            throw new RuntimeException("Department code already exists");
        }

        return departmentRepository.save(department);
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Department getDepartmentById(Long id) {

        return departmentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Department not found"));
    }

    public Department getDepartmentByCode(String code) {

        return departmentRepository.findByCode(code)
                .orElseThrow(() ->
                        new RuntimeException("Department not found"));
    }

    public Department updateDepartment(
            Long id,
            Department updatedDepartment
    ) {

        Department existingDepartment = getDepartmentById(id);

        existingDepartment.setCode(updatedDepartment.getCode());
        existingDepartment.setName(updatedDepartment.getName());

        return departmentRepository.save(existingDepartment);
    }

    public void deleteDepartment(Long id) {

        Department department = getDepartmentById(id);

        departmentRepository.delete(department);
    }
}