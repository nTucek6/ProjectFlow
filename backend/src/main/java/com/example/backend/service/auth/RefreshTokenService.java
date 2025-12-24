package com.example.backend.service.auth;

import com.example.backend.configuration.JwtProperties;
import com.example.backend.model.RefreshToken;
import com.example.backend.repository.RefreshTokenRepository;
import com.example.backend.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
@Transactional
@Slf4j
public class RefreshTokenService {
    private RefreshTokenRepository refreshTokenRepository;
    private UserService userService;

    private final JwtProperties jwtProperties;

    public RefreshToken createRefreshToken(String email) {
        Optional<RefreshToken> existingRefreshToken = refreshTokenRepository.findByUserInfo_Email(email);
        existingRefreshToken.ifPresent(_ -> {
                    refreshTokenRepository.delete(existingRefreshToken.get());
                    refreshTokenRepository.flush();
                }
        );

        log.info(String.valueOf(jwtProperties.getRefreshTokenExpire()));

        RefreshToken refreshToken = RefreshToken.builder()
                .userInfo(userService.findByEmail(email))
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusSeconds(this.jwtProperties.getRefreshTokenExpireSeconds()))
                .build();
        return refreshTokenRepository.save(refreshToken);
    }

    public void deleteRefreshToken(RefreshToken refreshToken) {
        Optional<RefreshToken> refreshTokenOptional = refreshTokenRepository.findByToken(refreshToken.getToken());
        if (refreshTokenOptional.isPresent()) {
            refreshTokenRepository.delete(refreshToken);
        } else {
            throw new EntityNotFoundException("Refresh Token is not in DB..!!");
        }
    }

    public RefreshToken findByTokenId(Long id) {
        Optional<RefreshToken> optionalToken = refreshTokenRepository.findById(id);
        if (optionalToken.isPresent()) {
            return optionalToken.get();
        } else {
            log.warn("RefreshToken not found for id: " + id);
            // handle not found case
            return null;
        }
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException(token.getToken() + " Refresh token is expired. Please make a new login..!");
        }
        return token;
    }

    @Transactional
    public void deleteExpiredTokens() {
        Instant now = Instant.now();
        refreshTokenRepository.deleteAllByExpiryDateBefore(now);
    }
}
