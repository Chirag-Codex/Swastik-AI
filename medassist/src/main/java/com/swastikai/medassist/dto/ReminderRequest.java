package com.swastikai.medassist.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalTime;

@Data
public class ReminderRequest {
    @NotNull private Long medicineId;
    @NotNull private LocalTime time;
    private String frequency; // DAILY, WEEKLY, CUSTOM
}