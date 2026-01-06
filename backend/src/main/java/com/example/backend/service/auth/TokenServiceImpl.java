package com.example.backend.service.auth;

import com.example.backend.configuration.JwtProperties;
import com.example.backend.dto.GenerateMentorTokenDto;
import com.example.backend.model.table.MentorRegisterToken;
import com.example.backend.model.table.RefreshToken;
import com.example.backend.model.table.User;
import com.example.backend.model.table.VerificationToken;
import com.example.backend.repository.MentorRegisterTokenRepository;
import com.example.backend.repository.VerificationTokenRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.impl.lang.Function;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;

import java.security.Key;
import java.time.*;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
@AllArgsConstructor
public class TokenServiceImpl implements TokenService {
    private final RefreshTokenService refreshTokenService;
    private final VerificationTokenRepository verificationTokenRepository;
    private final MentorRegisterTokenRepository mentorRegTokenRepository;

    private final JwtProperties jwtProperties;

    public static final String SECRET = "357638792F423F4428472B4B6250655368566D597133743677398A2443164621";

    @Override
    public String generateToken(String email) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, email, jwtProperties.getAccessTokenExpire());
    }

    @Override
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    @Override
    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            final String username = extractEmail(token);
            return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public VerificationToken findVerificationToken(String token) {
        return verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new EntityNotFoundException("Verify token not found"));
    }

    @Override
    public String setVerificationToken(User user) {

        Map<String, Object> claims = new HashMap<>();

        String t1 = createToken(claims, user.getEmail(), 24 * 60);
        OffsetDateTime expire = extractExpiration(t1).toInstant()
                .atZone(ZoneId.systemDefault())
                .toOffsetDateTime();;

        VerificationToken token = new VerificationToken();
        token.setToken(t1);
        token.setUser(user);
        token.setExpiresAt(expire);

        return verificationTokenRepository.save(token).getToken();
    }

    @Override
    public void deleteVerifyToken(VerificationToken token) {
        verificationTokenRepository.delete(token);
    }

    @Override
    @Transactional
    public String createMentorRegisterToken(GenerateMentorTokenDto mentor) {
        Map<String, Object> claims = new HashMap<>();

        String t1 = createToken(claims, mentor.getEmail(), 24 * 60);
        OffsetDateTime expire = extractExpiration(t1).toInstant()
                .atZone(ZoneId.systemDefault())
                .toOffsetDateTime();;

        MentorRegisterToken mrt = new MentorRegisterToken();
        mrt.setEmail(mentor.getEmail());
        mrt.setToken(t1);
        mrt.setExpiresAt(expire);

        return mentorRegTokenRepository.save(mrt).getToken();
    }

    @Override
    public boolean validateMentorRegisterToken(String token) {
        MentorRegisterToken mrt = mentorRegTokenRepository.findByToken(token).orElseThrow(()-> new EntityNotFoundException("Token not found"));
        if (mrt.getExpiresAt().isBefore(OffsetDateTime.now())){
            throw new RuntimeException("Token expired");
        }
        return true;
    }


    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    //private String extractUserEmail(String token) {return extractClaim(token, Claims::getSubject);}

    private String createToken(Map<String, Object> claims, String email, int expire) {
        Date expiresAt = Date.from(Instant.now().plus(Duration.ofMinutes(expire)));
        //Date expiresAt = Date.from(Instant.now().plus(Duration.ofSeconds(expire)));
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(expiresAt)
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private void deleteOldRefreshToken(RefreshToken refreshToken) {
        refreshTokenService.deleteRefreshToken(refreshToken);
    }
}
