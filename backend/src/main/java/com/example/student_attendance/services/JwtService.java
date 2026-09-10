package com.example.student_attendance.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private static final Logger log =
            LoggerFactory.getLogger(JwtService.class);

    private final String secretKey;

    private final long expirationTime =
            1000L * 60 * 60;

    public JwtService(
            @Value("${jwt.secret}") String secretKey
    ) {
        this.secretKey = secretKey;

        // Sanity-check at startup: if this key is too short for HS256,
        // token verification will fail for every request with an error
        // that's easy to miss if isTokenValid() swallows it silently.
        int keyBytes = secretKey.getBytes(StandardCharsets.UTF_8).length;
        log.info(
                "JwtService initialized (secret length = {} bytes, {})",
                keyBytes,
                keyBytes < 32
                        ? "TOO SHORT for HS256, must be >= 32 bytes"
                        : "OK"
        );
    }

    private SecretKey getSigningKey() {

        return Keys.hmacShaKeyFor(
                secretKey.getBytes(StandardCharsets.UTF_8)
        );
    }

    public String generateToken(
            String email,
            String role
    ) {

        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + expirationTime
                        )
                )
                .signWith(getSigningKey())
                .compact();
    }

    public String extractEmail(String token) {

        return getClaims(token).getSubject();
    }

    public String extractRole(String token) {

        return getClaims(token)
                .get("role", String.class);
    }

    public boolean isTokenValid(String token) {

        try {
            getClaims(token);
            return true;

        } catch (Exception e) {
            // This used to fail silently, which made "cookie is sent but
            // still 401" impossible to diagnose. Logging the real cause
            // (expired, bad signature, malformed, etc.) here instead.
            log.warn(
                    "JWT rejected: {} - {}",
                    e.getClass().getSimpleName(),
                    e.getMessage()
            );
            return false;
        }
    }

    private Claims getClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}