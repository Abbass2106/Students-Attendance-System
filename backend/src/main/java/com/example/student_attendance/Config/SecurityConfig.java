package com.example.student_attendance.Config;

import com.example.student_attendance.Security.JwtAccessDeniedHandler;
import com.example.student_attendance.Security.JwtAuthenticationEntryPoint;
import com.example.student_attendance.Security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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

        this.jwtAuthenticationFilter =
                jwtAuthenticationFilter;

        this.authenticationEntryPoint =
                authenticationEntryPoint;

        this.accessDeniedHandler =
                accessDeniedHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(cors -> {
                })

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .exceptionHandling(exception ->
                        exception
                                .authenticationEntryPoint(
                                        authenticationEntryPoint
                                )
                                .accessDeniedHandler(
                                        accessDeniedHandler
                                )
                )

                .authorizeHttpRequests(auth -> auth

                        /*
                         * LOGIN
                         */
                        .requestMatchers(
                                "/api/users/login"
                        ).permitAll()

                        /*
                         * CURRENT USER
                         */
                        .requestMatchers(
                                "/api/users/me"
                        ).authenticated()

                        /*
                         * USER MANAGEMENT
                         */
                        .requestMatchers(
                                "/api/users/**"
                        ).hasRole("ADMIN")

                        /*
                         * DEPARTMENTS
                         */
                        .requestMatchers(
                                "/api/departments/**"
                        ).hasRole("ADMIN")

                        /*
                         * PROGRAMS
                         */
                        .requestMatchers(
                                "/api/programs/**"
                        ).hasRole("ADMIN")

                        /*
                         * COURSES
                         */
                        .requestMatchers(
                                "/api/courses/**"
                        ).hasRole("ADMIN")

                        /*
                         * STUDENT SELF-SERVICE
                         */
                        .requestMatchers(
                                "/api/students/me",
                                "/api/students/me/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "TEACHER",
                                "STUDENT"
                        )

                        /*
                         * STUDENT IMPORT
                         */
                        .requestMatchers(
                                "/api/students/import"
                        ).hasRole("ADMIN")

                        /*
                         * STUDENT MANAGEMENT
                         */
                        .requestMatchers(
                                "/api/students/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "TEACHER"
                        )

                        /*
                         * =================================================
                         * CLASS TEACHER ASSIGNMENT
                         * =================================================
                         *
                         * Only ADMIN can:
                         *
                         * PUT    /api/classes/{classId}/teacher/{teacherId}
                         * DELETE /api/classes/{classId}/teacher
                         */
                        .requestMatchers(
                                "/api/classes/*/teacher/*",
                                "/api/classes/*/teacher"
                        ).hasRole("ADMIN")

                        /*
                         * OTHER CLASS OPERATIONS
                         */
                        .requestMatchers(
                                "/api/classes/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "TEACHER"
                        )

                        /*
                         * ENROLLMENTS
                         */
                        .requestMatchers(
                                "/api/enrollments/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "TEACHER"
                        )

                        /*
                         * ATTENDANCE SESSIONS
                         */
                        .requestMatchers(
                                "/api/attendance-sessions/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "TEACHER"
                        )

                        /*
                         * ATTENDANCE
                         */
                        .requestMatchers(
                                "/api/attendance/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "TEACHER"
                        )

                        /*
                         * EVERYTHING ELSE
                         */
                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }
}