package com.example.backend.configuration;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "jwt")
@Data
@NoArgsConstructor
public class JwtProperties {
    private String accessToken;
    private String refreshTokenId;
    private int accessTokenExpire;
    private long refreshTokenExpire;

    public long getRefreshTokenExpireSeconds() {
        return refreshTokenExpire * 86400L; // compute in Java
    }
}
