package com.swastikai.medassist.service.ai;

import com.swastikai.medassist.dto.ReminderRequest;
import com.swastikai.medassist.model.Medicine;
import com.swastikai.medassist.model.Reminder;
import com.swastikai.medassist.service.MedicineService;
import com.swastikai.medassist.service.ReminderService;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.util.List;

@Component
public class ReminderTools {

    private final ReminderService reminderService;
    private final MedicineService medicineService;

    public ReminderTools(ReminderService reminderService, MedicineService medicineService) {
        this.reminderService = reminderService;
        this.medicineService = medicineService;
    }

    private String getCurrentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @Tool(description = "Create a medicine reminder for the currently authenticated user. " +
            "Expects medicineName (string), time (string in HH:mm), frequency (string: DAILY, WEEKLY, CUSTOM).")
    public String createReminder(String medicineName, String time, String frequency) {
        String userEmail = getCurrentUserEmail();
        try {
            List<Medicine> medicines = medicineService.searchMedicinesByName(userEmail, medicineName);
            if (medicines.isEmpty()) {
                return "No medicine found with name '" + medicineName + "'. Please add the medicine first.";
            }
            Long medicineId = medicines.get(0).getId();

            ReminderRequest request = new ReminderRequest();
            request.setMedicineId(medicineId);
            request.setTime(LocalTime.parse(time));
            request.setFrequency(frequency != null ? frequency.toUpperCase() : "DAILY");

            reminderService.createReminder(userEmail, request);
            return "Reminder created for " + medicineName + " at " + time + " (" + frequency + ")";
        } catch (Exception e) {
            return "Failed to create reminder: " + e.getMessage();
        }
    }

    @Tool(description = "List all active reminders for the currently authenticated user.")
    public String listReminders() {
        String userEmail = getCurrentUserEmail();
        List<Reminder> reminders = reminderService.getActiveRemindersForUser(userEmail);
        if (reminders.isEmpty()) {
            return "You have no active reminders.";
        }
        StringBuilder sb = new StringBuilder("Your active reminders:\n");
        for (Reminder r : reminders) {
            sb.append("- ").append(r.getMedicine().getName())
                    .append(" at ").append(r.getTime())
                    .append(" (").append(r.getFrequency()).append(")\n");
        }
        return sb.toString();
    }

    @Tool(description = "Cancel (deactivate) an existing reminder by its ID.")
    public String cancelReminder(Long reminderId) {
        try {
            reminderService.toggleActive(reminderId, false);
            return "Reminder with ID " + reminderId + " has been cancelled.";
        } catch (Exception e) {
            return "Failed to cancel reminder: " + e.getMessage();
        }
    }
}