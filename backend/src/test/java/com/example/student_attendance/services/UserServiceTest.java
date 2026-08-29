package com.example.student_attendance.services;

import com.example.student_attendance.models.LoginResponse;
import com.example.student_attendance.models.Role;
import com.example.student_attendance.models.User;
import com.example.student_attendance.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private UserService userService;

    @Test
    void login_should_generate_token_using_user_role_not_password() {
        User user = new User();
        user.setEmail("admin@test.com");
        user.setPassword("encodedPassword");
        user.setRole(Role.ADMIN);

        when(userRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("rawPassword", "encodedPassword")).thenReturn(true);
        when(jwtService.generateToken("admin@test.com", "ADMIN")).thenReturn("jwt-token");

        LoginResponse response = userService.login("admin@test.com", "rawPassword");

        assertEquals("jwt-token", response.getToken());
        assertEquals(Role.ADMIN, response.getRole());
        verify(jwtService).generateToken(eq("admin@test.com"), eq("ADMIN"));
    }
}
