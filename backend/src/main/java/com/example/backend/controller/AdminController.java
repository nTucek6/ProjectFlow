package com.example.backend.controller;

import com.example.backend.dto.GenerateMentorTokenDto;
import com.example.backend.model.EmailDetails;
import com.example.backend.service.EmailService;
import com.example.backend.service.auth.TokenService;
import com.example.backend.utils.EmailUtil;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@AllArgsConstructor
@Slf4j
public class AdminController {

    private final TokenService tokenService;
    private final EmailService emailService;

    @PostMapping("/generateMentorToken")
    public ResponseEntity<String> generateMentorToken(@RequestBody GenerateMentorTokenDto mentor){
        try{
            String token = tokenService.createMentorRegisterToken(mentor);

            EmailDetails email = EmailUtil.emailStructure(
                    mentor.getEmail(),
                    "ProjectFlow - Your mentor register link!",
                    EmailUtil.generateMentorTokenMessage(token));

            String status = emailService.sendSimpleMail(email);
            log.info(status);

            return ResponseEntity.noContent().build();
        } catch (Exception e)
        {
            log.info("Token error", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }

    }


}
