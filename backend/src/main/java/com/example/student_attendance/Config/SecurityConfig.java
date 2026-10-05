package com.example.student_attendance.Config;

import com.example.student_attendance.Security.JwtAccessDeniedHandler;
import com.example.student_attendance.Security.JwtAuthenticationEntryPoint;
import com.example.student_attendance.Security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint authenticationEntryPoint;
    private final JwtAccessDeniedHandler accessDeniedHandler;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            JwtAuthenticationEntryPoint authenticationEntryPoint,
            JwtAccessDeniedHandler accessDeniedHandler
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.authenticationEntryPoint = authenticationEntryPoint;
        this.accessDeniedHandler = accessDeniedHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {
                })
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler))

                .authorizeHttpRequests(auth -> auth

                        // ---- Public ----
                        .requestMatchers("/api/users/login", "/api/users/logout").permitAll()
                        .requestMatchers("/error").permitAll()

                        // ---- Current user ----
                        .requestMatchers("/api/users/me").authenticated()

                        // ---- Admin-only structure & users ----
                        .requestMatchers("/api/users/**").hasRole("ADMIN")
                        .requestMatchers("/api/departments/**").hasRole("ADMIN")
                        .requestMatchers("/api/programs/**").hasRole("ADMIN")

                        // Courses: teachers may READ (to show course names), only admin writes
                        .requestMatchers(HttpMethod.GET, "/api/courses/**").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers("/api/courses/**").hasRole("ADMIN")

                        // ---- Students ----
                        .requestMatchers("/api/students/me", "/api/students/me/**")
                                .hasAnyRole("ADMIN", "TEACHER", "STUDENT")
                        .requestMatchers("/api/students/import").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/students/**").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers("/api/students/**").hasRole("ADMIN") // create / update / delete

                        // ---- Classes ----
                        .requestMatchers("/api/classes/*/teacher/*", "/api/classes/*/teacher").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/classes/**").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers("/api/classes/**").hasRole("ADMIN") // create / update / delete

                        // ---- Enrollments (teacher access is ownership-checked in the service) ----
                        .requestMatchers("/api/enrollments/**").hasAnyRole("ADMIN", "TEACHER")

                        // ---- Attendance (teacher access is ownership-checked in the service) ----
                        .requestMatchers("/api/attendance-sessions/**").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers("/api/attendance/**").hasAnyRole("ADMIN", "TEACHER")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}