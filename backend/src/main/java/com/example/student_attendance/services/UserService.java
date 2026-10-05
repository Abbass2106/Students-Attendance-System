package com.example.student_attendance.services;

import com.example.student_attendance.Exceptions.ApiException;
import com.example.student_attendance.models.Role;
import com.example.student_attendance.models.User;
import com.example.student_attendance.repositories.ClassesRepository;
import com.example.student_attendance.repositories.UserRepository;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final ClassesRepository classesRepository;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            ClassesRepository classesRepository
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.classesRepository = classesRepository;
    }

    public User createUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new ApiException("User already exists", 409);
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ApiException("User not found", 404));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found", 404));
    }

    // NEW
    public void deleteUser(Long id, Long currentUserId) {

        if (id.equals(currentUserId)) {
            throw new ApiException("You cannot delete your own account", 400);
        }

        User user = getUserById(id);

        if (user.getRole() == Role.TEACHER
                && !classesRepository.findByLecturerId(id).isEmpty()) {
            throw new ApiException(
                    "This teacher is still assigned to classes. Unassign them first.",
                    409);
        }

        userRepository.delete(user);
    }

    public String login(String email, String password) {

        User user = userRepository.findByEmail(email).orElse(null);

        // Same message for "no such user" and "wrong password" so the
        // login form can't be used to discover which emails exist.
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new ApiException("Invalid email or password", 401);
        }

        return jwtService.generateToken(
                user.getEmail(),
                user.getRole().name());
    }
}