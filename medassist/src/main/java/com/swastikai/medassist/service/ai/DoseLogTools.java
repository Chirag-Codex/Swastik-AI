package com.swastikai.medassist.service.ai;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.swastikai.medassist.model.DoseLog;
import com.swastikai.medassist.repository.DoseLogRepository;
import com.swastikai.medassist.service.DoseLogService;

@Component
public class DoseLogTools {

    private final DoseLogService doseLogService;
    private final DoseLogRepository doseLogRepository;

    private static final int LATE_THRESHOLD_MINUTES = 30; // 30 minutes grace period

    public DoseLogTools(DoseLogService doseLogService, DoseLogRepository doseLogRepository) {
        this.doseLogService = doseLogService;
        this.doseLogRepository = doseLogRepository;
    }

    private String getCurrentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @Tool(description = "Log that a dose was taken for a given reminder ID. " +
            "The system will automatically determine if it was on time or late based on the scheduled time.")
    public String logDoseTaken(Long reminderId) {
        String userEmail = getCurrentUserEmail();
        try {
           
            LocalDateTime now = LocalDateTime.now();

            java.util.List<DoseLog> pendingLogs = doseLogRepository.findByReminder(
                            doseLogService.getReminderById(reminderId)
                    ).stream()
                    .filter(d -> d.getStatus() == DoseLog.Status.PENDING)
                    .filter(d -> d.getScheduledTime().toLocalDate().equals(LocalDateTime.now().toLocalDate()))
                    .toList();

            if (pendingLogs.isEmpty()) {
                return "No pending dose found for reminder ID " + reminderId + ". The dose may have already been logged or expired.";
            }

            DoseLog pendingLog = pendingLogs.get(0);

       
            LocalDateTime scheduledTime = pendingLog.getScheduledTime();
            LocalDateTime takenTime = LocalDateTime.now();

         
            LocalDateTime lateThreshold = scheduledTime.plusMinutes(LATE_THRESHOLD_MINUTES);
            boolean isLate = takenTime.isAfter(lateThreshold);

           
            pendingLog.setTakenAt(takenTime);
            pendingLog.setStatus(isLate ? DoseLog.Status.LATE : DoseLog.Status.TAKEN);
            doseLogRepository.save(pendingLog);

            String status = isLate ? "LATE" : "TAKEN";
            String message = isLate ?
                    "Dose logged as taken but LATE (taken " +
                            (java.time.Duration.between(scheduledTime, takenTime).toMinutes()) +
                            " minutes after scheduled time)" :
                    "Dose logged as taken ON TIME";

            return "✅ " + message + " for reminder ID " + reminderId + ".";

        } catch (Exception e) {
            return " Failed to log dose: " + e.getMessage();
        }
    }

    @Tool(description = "Get dose history (all logs) for the current user.")
    public String getDoseHistory() {
        String userEmail = getCurrentUserEmail();
        try {
            List<DoseLog> logs = doseLogService.getDoseLogsForUser(userEmail);
            if (logs.isEmpty()) {
                return "No dose logs found.";
            }
            StringBuilder sb = new StringBuilder("📋 Dose history (last 10 entries):\n");
            logs.stream()
                    .limit(10)
                    .forEach(log -> {
                        sb.append("• ").append(log.getReminder().getMedicine().getName())
                                .append(" scheduled: ").append(log.getScheduledTime().toLocalTime())
                                .append(" status: ").append(log.getStatus())
                                .append("\n");
                    });
            return sb.toString();
        } catch (Exception e) {
            return "Failed to get dose history: " + e.getMessage();
        }
    }
}