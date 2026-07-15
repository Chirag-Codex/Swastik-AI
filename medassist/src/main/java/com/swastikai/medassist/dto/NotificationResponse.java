package com.swastikai.medassist.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private Long userId;
    private Long reminderId;
    private String medicineName;
    private String channel;
    private String message;
    private String status;
    private LocalDate scheduledFor;
    private boolean readFlag;
    private LocalDateTime createdAt;
}