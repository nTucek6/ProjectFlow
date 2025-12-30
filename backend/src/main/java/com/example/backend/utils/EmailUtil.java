package com.example.backend.utils;

import com.example.backend.model.EmailDetails;

public class EmailUtil {

    public static EmailDetails emailStructure(String recipient, String subject, String message)
    {
        EmailDetails email = new EmailDetails();
        email.setSubject(subject);
        email.setMsgBody(message);
        email.setRecipient(recipient);
        return email;
    }

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

    public static String generateMentorTokenMessage(String token)
    {
        String verifyUrl = String.format(
                "http://localhost:4200/register/%s",
                token
        );
        return """
                    <p>Hello,</p>
                    <p>Please register your account by clicking the link below:</p>
                    <p><a href="%s" target="_blank">Register here</a></p>
                    <p>This link will expire in 24 hours.</p>
                    <p>This link is one time use.</p>
                """.formatted(verifyUrl);
    }


}
