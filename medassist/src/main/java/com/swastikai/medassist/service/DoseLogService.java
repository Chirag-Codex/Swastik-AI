package com.swastikai.medassist.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.swastikai.medassist.model.DoseLog;
import com.swastikai.medassist.model.Reminder;
import com.swastikai.medassist.model.User;
import com.swastikai.medassist.repository.DoseLogRepository;
import com.swastikai.medassist.repository.ReminderRepository;
import com.swastikai.medassist.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DoseLogService {

    private final DoseLogRepository doseLogRepository;
    private final ReminderRepository reminderRepository;
    private final UserRepository userRepository;

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public Reminder getReminderById(Long id) {
        return reminderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reminder not found"));
    }

    @Transactional
    public DoseLog logDose(Long reminderId, boolean taken, boolean late) {
        Reminder reminder = getReminderById(reminderId);
        DoseLog log = new DoseLog();
        log.setReminder(reminder);
        log.setScheduledTime(LocalDateTime.now());
        if (taken) {
            log.setTakenAt(LocalDateTime.now());
            log.setStatus(late ? DoseLog.Status.LATE : DoseLog.Status.TAKEN);
        } else {
            log.setTakenAt(null);
            log.setStatus(DoseLog.Status.MISSED);
        }
        return doseLogRepository.save(log);
    }

    
    @Transactional
    public DoseLog confirmDoseTaken(Long reminderId, LocalDateTime takenAt, boolean isLate) {
        Reminder reminder = getReminderById(reminderId);

        List<DoseLog> pendingLogs = doseLogRepository.findByReminder(reminder)
                .stream()
                .filter(d -> d.getStatus() == DoseLog.Status.PENDING)
                .filter(d -> d.getScheduledTime().toLocalDate().equals(LocalDateTime.now().toLocalDate()))
                .toList();

        if (pendingLogs.isEmpty()) {
            throw new IllegalStateException("No pending dose found for reminder " + reminderId + " today");
        }

        DoseLog pendingLog = pendingLogs.get(0);
        pendingLog.setTakenAt(takenAt);
        pendingLog.setStatus(isLate ? DoseLog.Status.LATE : DoseLog.Status.TAKEN);
        return doseLogRepository.save(pendingLog);
    }

    public List<DoseLog> getDoseLogsForUser(String userEmail) {
        User user = getUserByEmail(userEmail);
        List<Reminder> reminders = reminderRepository.findByUser(user);
        return reminders.stream()
                .flatMap(r -> doseLogRepository.findByReminder(r).stream())
                .toList();
    }
}