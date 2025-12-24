package com.example.backend.utils;

public class EmailMessageUtil {

    public static String verifyEmailMessage(String token) {
        String verifyUrl = String.format(
                "http://localhost:4200/verify/%s",
                token
        );

        return """
                    <p>Hello,</p>
                    <p>Please verify your account by clicking the link below:</p>
                    <p><a href="%s" target="_blank">Verify account</a></p>
                    <p>This link will expire in 24 hours.</p>
                """.formatted(verifyUrl);
    }


}
