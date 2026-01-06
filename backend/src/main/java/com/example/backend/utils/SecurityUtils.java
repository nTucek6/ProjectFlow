package com.example.backend.utils;

import com.example.backend.service.auth.CustomUserDetails;
import lombok.NoArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@NoArgsConstructor
public class SecurityUtils {

    private static Authentication getAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null; // or throw exception
        }
        return authentication;
    }

    public static CustomUserDetails getPrincipal(){
        Authentication authentication = getAuthentication();
        CustomUserDetails principal = null;
        if (authentication != null) {
            principal = (CustomUserDetails) authentication.getPrincipal();
        }
        return principal;
    }

    public static Long getCurrentUserId() {
       return getPrincipal().getId();
    }

}
