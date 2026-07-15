package com.swastikai.medassist.controller;

import com.swastikai.medassist.dto.NotificationResponse;
import com.swastikai.medassist.model.Notification;
import com.swastikai.medassist.model.User;
import com.swastikai.medassist.repository.NotificationRepository;
import com.swastikai.medassist.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getNotifications(@AuthenticationPrincipal String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(user);

        List<NotificationResponse> responses = notifications.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/unread/count")
    public ResponseEntity<Long> getUnreadCount(@AuthenticationPrincipal String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        long count = notificationRepository.countByUserAndReadFlagFalse(user);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/unread")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotifications(@AuthenticationPrincipal String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<Notification> notifications = notificationRepository.findByUserAndReadFlagFalseOrderByCreatedAtDesc(user);

        List<NotificationResponse> responses = notifications.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@AuthenticationPrincipal String userEmail,
                                           @PathVariable Long id) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));

        // Security check: ensure notification belongs to the authenticated user
        if (!notification.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();  // ✅ FIXED HERE
        }

        notification.setReadFlag(true);
        notificationRepository.save(notification);

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/mark-all-read")
    public ResponseEntity<Void> markAllAsRead(@AuthenticationPrincipal String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<Notification> unread = notificationRepository.findByUserAndReadFlagFalseOrderByCreatedAtDesc(user);
        unread.forEach(n -> n.setReadFlag(true));
        notificationRepository.saveAll(unread);

        return ResponseEntity.noContent().build();
    }

    private NotificationResponse toResponse(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getUser().getId(),
                notification.getReminder().getId(),
                notification.getReminder().getMedicine().getName(),
                notification.getChannel().name(),
                notification.getMessage(),
                notification.getStatus().name(),
                notification.getScheduledFor(),
                notification.isReadFlag(),
                notification.getCreatedAt()
        );
    }
}