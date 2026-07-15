package com.swastikai.medassist.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class DoseLogResponse {
    private Long id;
    private Long reminderId;
    private String medicineName;
    private LocalDateTime scheduledTime;
    private LocalDateTime takenAt;
    private String status;
}