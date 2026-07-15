package com.swastikai.medassist.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ReminderResponse {
    private Long id;
    private Long medicineId;
    private String medicineName;
    private LocalTime time;
    private String frequency;
    private boolean active;
    private LocalDateTime createdAt;
}