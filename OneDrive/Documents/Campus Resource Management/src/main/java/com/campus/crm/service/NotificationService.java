package com.campus.crm.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);
    private final JavaMailSender emailSender;

    @Value("${spring.mail.username:noreply@campus.com}") // Default fallback
    private String fromEmail;

    @Async
    public void sendNotification(String to, String subject, String text) {
        logger.info("Sending email to {}: Subject: {}", to, subject);
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail != null ? fromEmail : "noreply@campus.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            emailSender.send(message);
        } catch (Exception e) {
            logger.error("Failed to send email to {}: {}", to, e.getMessage());
            // In a real app, we might retry or log this to a persistent error table
        }
    }
}
