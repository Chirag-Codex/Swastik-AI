package com.swastikai.medassist.service;

import com.swastikai.medassist.dto.ReminderRequest;
import com.swastikai.medassist.model.Medicine;
import com.swastikai.medassist.model.Reminder;
import com.swastikai.medassist.model.User;
import com.swastikai.medassist.repository.MedicineRepository;
import com.swastikai.medassist.repository.ReminderRepository;
import com.swastikai.medassist.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReminderService {

    private final ReminderRepository reminderRepository;
    private final UserRepository userRepository;
    private final MedicineRepository medicineRepository;

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Transactional
    public Reminder createReminder(String userEmail, ReminderRequest request) {
        User user = getUserByEmail(userEmail);
        Medicine medicine = medicineRepository.findById(request.getMedicineId())
                .orElseThrow(() -> new IllegalArgumentException("Medicine not found"));
        Reminder reminder = new Reminder();
        reminder.setUser(user);
        reminder.setMedicine(medicine);
        reminder.setTime(request.getTime());
        if (request.getFrequency() != null) {
            reminder.setFrequency(Reminder.Frequency.valueOf(request.getFrequency().toUpperCase()));
        }
        reminder.setActive(true);
        return reminderRepository.save(reminder);
    }

    public List<Reminder> getActiveRemindersForUser(String userEmail) {
        return reminderRepository.findByUserAndActiveTrue(getUserByEmail(userEmail));
    }

    public List<Reminder> getAllRemindersForUser(String userEmail) {
        return reminderRepository.findByUser(getUserByEmail(userEmail));
    }

    public Reminder getReminderById(Long id) {
        return reminderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reminder not found"));
    }

    @Transactional
    public Reminder updateReminder(Long id, ReminderRequest request) {
        Reminder reminder = getReminderById(id);
        Medicine medicine = medicineRepository.findById(request.getMedicineId())
                .orElseThrow(() -> new IllegalArgumentException("Medicine not found"));
        reminder.setMedicine(medicine);
        reminder.setTime(request.getTime());
        if (request.getFrequency() != null) {
            reminder.setFrequency(Reminder.Frequency.valueOf(request.getFrequency().toUpperCase()));
        }
        return reminderRepository.save(reminder);
    }

    @Transactional
    public void deleteReminder(Long id) {
        reminderRepository.deleteById(id);
    }

    @Transactional
    public void toggleActive(Long id, boolean active) {
        Reminder reminder = getReminderById(id);
        reminder.setActive(active);
        reminderRepository.save(reminder);
    }
}