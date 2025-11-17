package com.example.backend.utils;

import com.example.backend.configuration.JwtProperties;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;

import java.time.Duration;

@Slf4j
@AllArgsConstructor
public class CookieUtil {
    public static ResponseCookie createAccessTokenCookie(String accessToken, String accessTokenName, long accessTokenExpire)
    {
        return ResponseCookie.from(accessTokenName, accessToken)
                .httpOnly(true)
                .secure(true)
                .path("/api")
                .maxAge(Duration.ofMinutes(accessTokenExpire))
                .sameSite("Strict")
                .build();
    }

    public static ResponseCookie createRefreshTokenIdCookie(String refreshTokenId, String refreshTokenName, long refreshTokenExpire)
    {
        return ResponseCookie.from(refreshTokenName, refreshTokenId)
                .httpOnly(true)
                .secure(true)
                .path("/auth/api/v1")
                .maxAge(Duration.ofDays(refreshTokenExpire))
                .sameSite("Strict")
                .build();
    }

    public static void addAccessTokenCookieToResponse(HttpServletResponse response, String accessToken, String accessTokenName, long accessTokenExpire) {
        ResponseCookie cookie = createAccessTokenCookie(accessToken, accessTokenName, accessTokenExpire);
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    public static void addRefreshTokenIdCookieToResponse(HttpServletResponse response, String refreshTokenId, String refreshTokenName,  long refreshTokenExpire) {
        ResponseCookie cookie = createRefreshTokenIdCookie(refreshTokenId, refreshTokenName, refreshTokenExpire);
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }


    public static ResponseCookie clearCookie(HttpServletResponse response, String cookieName, String path) {
        ResponseCookie clearedCookie = ResponseCookie.from(cookieName, "")
                .httpOnly(true)
                .secure(true)
                .path(path)
                .maxAge(0)
                .sameSite("Strict")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, clearedCookie.toString());
        return clearedCookie;
    }
}
