package com.swastikai.medassist.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final String fromEmail;

    public EmailService(JavaMailSender mailSender,
                        @Value("${spring.mail.username}") String fromEmail,
                        @Value("${spring.mail.password}") String mailPassword) {
        if (fromEmail == null || fromEmail.isBlank()) {
            throw new IllegalStateException("spring.mail.username must be configured for production deployments.");
        }
        if (mailPassword == null || mailPassword.isBlank()) {
            throw new IllegalStateException("spring.mail.password must be configured for production deployments.");
        }
        this.mailSender = mailSender;
        this.fromEmail = fromEmail;
    }

    public boolean sendReminderEmail(String toEmail, String medicineName, String time) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("⏰ Medicine Reminder from Swastik AI");

            String htmlContent = String.format("""
                    <html>
                    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f6f9;">
                        <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                            <h1 style="color: #2c3e50; text-align: center;">💊 Swastik AI</h1>
                            <h2 style="color: #e74c3c; text-align: center;">Time to Take Your Medicine!</h2>
                            
                            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                <p style="font-size: 18px; margin: 10px 0;">
                                    <strong>Medicine:</strong> %s
                                </p>
                                <p style="font-size: 18px; margin: 10px 0;">
                                    <strong>Scheduled Time:</strong> %s
                                </p>
                            </div>
                            
                            <p style="color: #7f8c8d; text-align: center; margin-top: 30px;">
                                💡 Please take your medicine as prescribed by your doctor.
                            </p>
                            <p style="color: #95a5a6; text-align: center; font-size: 12px; margin-top: 20px;">
                                This is an automated reminder from Swastik AI - Your Personal Health Assistant
                            </p>
                        </div>
                    </body>
                    </html>
                    """, medicineName, time);

            helper.setText(htmlContent, true);

            mailSender.send(message);
            logger.info("Reminder email sent successfully to {} for medicine {}", toEmail, medicineName);
            return true;

        } catch (MessagingException e) {
            logger.error("Failed to send reminder email to {} for medicine {}: {}",
                    toEmail, medicineName, e.getMessage(), e);
            return false;
        } catch (Exception e) {
            logger.error("Unexpected error sending reminder email to {}: {}", toEmail, e.getMessage(), e);
            return false;
        }
    }
}