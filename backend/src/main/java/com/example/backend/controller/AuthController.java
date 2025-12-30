package com.example.backend.controller;

import com.example.backend.configuration.JwtProperties;
import com.example.backend.dto.auth.LoginRequestDTO;
import com.example.backend.dto.auth.RegisterRequestDto;
import com.example.backend.dto.UserDto;
import com.example.backend.mapper.UserMapper;
import com.example.backend.model.EmailDetails;
import com.example.backend.model.table.RefreshToken;
import com.example.backend.model.table.User;
import com.example.backend.model.table.VerificationToken;
import com.example.backend.service.EmailService;
import com.example.backend.service.UserService;
import com.example.backend.service.auth.TokenService;
import com.example.backend.service.auth.RefreshTokenService;
import com.example.backend.utils.CookieUtil;
import com.example.backend.utils.EmailUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

@RestController
@RequestMapping("auth/api/v1")
@AllArgsConstructor
@lombok.extern.slf4j.Slf4j
public class AuthController {

    private final UserService userService;
    private final TokenService tokenService;
    private final EmailService emailService;
    private AuthenticationManager authenticationManager;

    private TokenService tokenServiceImpl;

    private RefreshTokenService refreshTokenService;

    private final JwtProperties jwtProperties;


    @PostMapping("/login")
    public ResponseEntity<?> authenticateAndGetToken(@RequestBody LoginRequestDTO authRequestDTO, HttpServletResponse response) {
        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequestDTO.getEmail(), authRequestDTO.getPassword()));
            String email = ((UserDetails) authentication.getPrincipal()).getUsername();

            User user = userService.findByEmail(email);

            if (user.isEnabled()) {
                UserDto userDto = UserMapper.mapUserToUserDto(user);

                RefreshToken refreshToken = refreshTokenService.createRefreshToken(email);
                String accessToken = tokenServiceImpl.generateToken(email);

                CookieUtil.addRefreshTokenIdCookieToResponse(response, String.valueOf(refreshToken.getId()), jwtProperties.getRefreshTokenId(), jwtProperties.getRefreshTokenExpire());
                CookieUtil.addAccessTokenCookieToResponse(response, accessToken, jwtProperties.getAccessToken(), jwtProperties.getAccessTokenExpire());

                return ResponseEntity.ok(userDto);
            } else {
                throw new RuntimeException("User is not verified!");
            }


        } catch (RuntimeException e) {
            log.info("AuthenticationException", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<String> register(@RequestBody RegisterRequestDto registerRequest) {
        try {
            User newUser = userService.registerUser(registerRequest);

            String token = tokenService.setVerificationToken(newUser);

            EmailDetails email = EmailUtil.emailStructure(
                    newUser.getEmail(),
                    "ProjectFlow - Verify you email!",
                    EmailUtil.verifyEmailMessage(token));

            String status = emailService.sendSimpleMail(email);
            log.info(status);

            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.info("RegisterException", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @GetMapping("/verifyMentorToken")
    public ResponseEntity<?> verifyMentorToken(@RequestParam String verifyToken){
        try {
            Boolean valid = tokenService.validateMentorRegisterToken(verifyToken);
            return ResponseEntity.ok(valid);

        } catch (Exception e) {
            log.info(e.getLocalizedMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verify(@RequestParam String verifyToken) {
        try {
            VerificationToken vt = tokenService.findVerificationToken(verifyToken);

            if (vt.getExpiresAt().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Token expired!");
            }

            User user = vt.getUser();
            user.setEnabled(true);
            userService.save(user);

            tokenService.deleteVerifyToken(vt);

            return ResponseEntity.ok(Boolean.TRUE);

        } catch (Exception e) {
            log.info(e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/resendtoken")
    public ResponseEntity<?> resendToken(@RequestParam String verifyToken) {
        try {

            VerificationToken oldToken = tokenService.findVerificationToken(verifyToken);

            User user = oldToken.getUser();

            tokenService.deleteVerifyToken(oldToken);

            String token = tokenService.setVerificationToken(user);

            EmailDetails email = EmailUtil.emailStructure(
                    user.getEmail(),
                    "ProjectFlow - Verify you email!",
                    EmailUtil.verifyEmailMessage(token));

            String status = emailService.sendSimpleMail(email);
            log.info(status);

            return ResponseEntity.ok(Boolean.TRUE);

        } catch (Exception e) {
            log.info(e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PostMapping("/refreshToken")
    public ResponseEntity<UserDto> refreshToken(HttpServletRequest request, HttpServletResponse response) {

        String refreshTokenId = Arrays.stream(Optional.ofNullable(request.getCookies()).orElse(new Cookie[0]))
                .filter(c -> jwtProperties.getRefreshTokenId().equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        RefreshToken refreshToken = refreshTokenService.findByTokenId(Long.valueOf(refreshTokenId));

        if (refreshToken == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token does not exist");
        } else if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenService.deleteRefreshToken(refreshToken); // optional cleanup
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token expired");
        }

        User user = userService.findByEmail(refreshToken.getUserInfo().getEmail());

        String accessToken = tokenServiceImpl.generateToken(user.getEmail());

        CookieUtil.addAccessTokenCookieToResponse(response, accessToken, jwtProperties.getAccessToken(), jwtProperties.getAccessTokenExpire());

        return ResponseEntity.ok(UserMapper.mapUserToUserDto(user));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(HttpServletRequest request, HttpServletResponse response) {

        String refreshTokenId = Arrays.stream(Optional.ofNullable(request.getCookies()).orElse(new Cookie[0]))
                .filter(c -> jwtProperties.getRefreshTokenId().equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        RefreshToken refreshToken = refreshTokenService.findByTokenId(Long.valueOf(refreshTokenId));

        if (refreshToken == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token does not exist");
        } else if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenService.deleteRefreshToken(refreshToken); // optional cleanup
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token expired");
        }

        User user = userService.findByEmail(refreshToken.getUserInfo().getEmail());

        return ResponseEntity.ok(UserMapper.mapUserToUserDto(user));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshTokenId = Arrays.stream(Optional.ofNullable(request.getCookies()).orElse(new Cookie[0]))
                .filter(c -> jwtProperties.getRefreshTokenId().equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        RefreshToken refreshToken = refreshTokenService.findByTokenId(Long.valueOf(refreshTokenId));

        refreshTokenService.deleteRefreshToken(refreshToken);

        CookieUtil.clearCookie(response, jwtProperties.getRefreshTokenId(), "/auth/api/v1");
        CookieUtil.clearCookie(response, jwtProperties.getAccessToken(), "/");

        return ResponseEntity.noContent().build();
    }
}
