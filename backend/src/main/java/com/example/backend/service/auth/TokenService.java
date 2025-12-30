package com.example.backend.service.auth;

import com.example.backend.dto.GenerateMentorTokenDto;
import com.example.backend.model.table.User;
import com.example.backend.model.table.VerificationToken;
import org.springframework.security.core.userdetails.UserDetails;

public interface TokenService {
    String generateToken(String subject);
    String extractEmail(String token);
    boolean validateToken(String token, UserDetails userDetails);
    VerificationToken findVerificationToken(String token);
    String setVerificationToken(User user);
    void deleteVerifyToken(VerificationToken token);

    String createMentorRegisterToken(GenerateMentorTokenDto mentor);
    boolean validateMentorRegisterToken(String token);

}
