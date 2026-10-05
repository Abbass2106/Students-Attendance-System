package com.example.student_attendance.controllers;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.security.core.Authentication;

import com.example.student_attendance.services.UserService;

import jakarta.validation.Valid;

import com.example.student_attendance.models.LoginRequest;
import com.example.student_attendance.models.User;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    // Secure/SameSite=None for real HTTPS cross-site deployments,
    // Secure=false/SameSite=Lax for plain-HTTP local dev.
    @Value("${app.cookie-secure:false}")
    private boolean cookieSecure;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    private ResponseCookie.ResponseCookieBuilder baseCookie(String value) {
        return ResponseCookie
                .from("accessToken", value)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(cookieSecure ? "None" : "Lax")
                .path("/");
    }

    @PostMapping
    public User createUser(@Valid @RequestBody User user) {
        return userService.createUser(user);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @GetMapping("/email/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }

    @GetMapping("/me")
    public User getCurrentUser(Authentication authentication) {
        return userService.getUserByEmail(authentication.getName());
    }

    // NEW: admin deletes a user (cannot delete self, or a teacher who still has classes)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User me = userService.getUserByEmail(authentication.getName());
        userService.deleteUser(id, me.getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {

        String token = userService.login(request.getEmail(), request.getPassword());

        ResponseCookie cookie = baseCookie(token).maxAge(60 * 60).build();

        return ResponseEntity
                .ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Login successful");
    }

    // NEW: the auth cookie is httpOnly, so only the server can clear it.
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {

        ResponseCookie cookie = baseCookie("").maxAge(0).build();

        return ResponseEntity
                .ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Logged out");
    }
}