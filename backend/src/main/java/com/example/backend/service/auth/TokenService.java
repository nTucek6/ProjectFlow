package com.example.backend.service.auth;

import com.example.backend.model.VerificationToken;
import org.springframework.security.core.userdetails.UserDetails;

public interface TokenService {
    String generateToken(String subject);
    String extractEmail(String token);
    boolean validateToken(String token, UserDetails userDetails);
    VerificationToken findVerificationToken(String token);
    void sendVerificationEmail(String email);
}
