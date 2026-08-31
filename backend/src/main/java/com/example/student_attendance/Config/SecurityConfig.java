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

        public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                        JwtAuthenticationEntryPoint authenticationEntryPoint,
                        JwtAccessDeniedHandler accessDeniedHandler) {
                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
                this.authenticationEntryPoint = authenticationEntryPoint;
                this.accessDeniedHandler = accessDeniedHandler;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http)
                        throws Exception {

                http
                                .csrf(csrf -> csrf.disable())

                                .cors(cors -> {
                                })

                                .sessionManagement(session -> session.sessionCreationPolicy(
                                                SessionCreationPolicy.STATELESS))

                                .exceptionHandling(exception -> exception
                                                .authenticationEntryPoint(authenticationEntryPoint)
                                                .accessDeniedHandler(accessDeniedHandler))

                                .authorizeHttpRequests(auth -> auth

                                                .requestMatchers("/api/users/login")
                                                .permitAll()

                                                .requestMatchers("/api/users/me")
                                                .authenticated()

                                                .requestMatchers("/api/users/**")
                                                .hasRole("ADMIN")

                                                .requestMatchers("/api/classes/**")
                                                .hasRole("ADMIN")

                                                .requestMatchers("/api/students/**")
                                                .hasAnyRole("ADMIN", "TEACHER")

                                                .requestMatchers("/api/attendance/**")
                                                .hasAnyRole("ADMIN", "TEACHER")

                                                .anyRequest()
                                                .authenticated())

                                .addFilterBefore(
                                                jwtAuthenticationFilter,
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }
}