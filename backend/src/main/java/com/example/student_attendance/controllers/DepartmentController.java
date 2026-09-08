package com.example.student_attendance.controllers;

import com.example.student_attendance.models.Department;
import com.example.student_attendance.services.DepartmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @PostMapping
    public ResponseEntity<Department> createDepartment(
            @RequestBody Department department
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        departmentService.createDepartment(department)
                );
    }

    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(
                departmentService.getAllDepartments()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Department> getDepartmentById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                departmentService.getDepartmentById(id)
        );
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<Department> getDepartmentByCode(
            @PathVariable String code
    ) {
        return ResponseEntity.ok(
                departmentService.getDepartmentByCode(code)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Department> updateDepartment(
            @PathVariable Long id,
            @RequestBody Department department
    ) {
        return ResponseEntity.ok(
                departmentService.updateDepartment(
                        id,
                        department
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartment(
            @PathVariable Long id
    ) {
        departmentService.deleteDepartment(id);

        return ResponseEntity.noContent().build();
    }
}