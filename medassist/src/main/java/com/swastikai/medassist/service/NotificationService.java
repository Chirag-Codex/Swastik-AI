package com.swastikai.medassist.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.swastikai.medassist.model.Notification;
import com.swastikai.medassist.model.Reminder;
import com.swastikai.medassist.model.User;
import com.swastikai.medassist.repository.NotificationRepository;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final EmailService emailService;

    public NotificationService(NotificationRepository notificationRepository, EmailService emailService) {
        this.notificationRepository = notificationRepository;
        this.emailService = emailService;
    }

    @Transactional
    public void sendNotificationsForReminder(Reminder reminder) {
        User user = reminder.getUser();
        LocalDate today = LocalDate.now();
        String medicineName = reminder.getMedicine().getName();
        String time = reminder.getTime().format(DateTimeFormatter.ofPattern("hh:mm a"));

        String message = String.format("Time to take %s at %s", medicineName, time);

     
        Notification inAppNotification = new Notification();
        inAppNotification.setUser(user);
        inAppNotification.setReminder(reminder);
        inAppNotification.setChannel(Notification.Channel.IN_APP);
        inAppNotification.setMessage(message);
        inAppNotification.setStatus(Notification.Status.SENT);
        inAppNotification.setScheduledFor(today);
        inAppNotification.setReadFlag(false);

        notificationRepository.save(inAppNotification);
        logger.info("IN_APP notification created for user {} for medicine {}", user.getEmail(), medicineName);

      
        Notification emailNotification = new Notification();
        emailNotification.setUser(user);
        emailNotification.setReminder(reminder);
        emailNotification.setChannel(Notification.Channel.EMAIL);
        emailNotification.setMessage(message);
        emailNotification.setScheduledFor(today);

        boolean emailSent = emailService.sendReminderEmail(user.getEmail(), medicineName, time);

        if (emailSent) {
            emailNotification.setStatus(Notification.Status.SENT);
            logger.info("EMAIL notification sent to {} for medicine {}", user.getEmail(), medicineName);
        } else {
            emailNotification.setStatus(Notification.Status.FAILED);
            logger.warn("EMAIL notification failed for {} for medicine {}", user.getEmail(), medicineName);
        }

        notificationRepository.save(emailNotification);
    }
}