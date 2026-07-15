package com.swastikai.medassist.controller;

import com.swastikai.medassist.dto.ReminderRequest;
import com.swastikai.medassist.dto.ReminderResponse;
import com.swastikai.medassist.model.Reminder;
import com.swastikai.medassist.service.ReminderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reminders")
@RequiredArgsConstructor
public class ReminderController {

    private final ReminderService reminderService;

    private ReminderResponse toResponse(Reminder r) {
        return new ReminderResponse(
                r.getId(),
                r.getMedicine().getId(),
                r.getMedicine().getName(),
                r.getTime(),
                r.getFrequency().name(),
                r.isActive(),
                r.getCreatedAt()
        );
    }

    @PostMapping
    public ResponseEntity<ReminderResponse> createReminder(@AuthenticationPrincipal String userEmail,
                                                           @Valid @RequestBody ReminderRequest request) {
        Reminder saved = reminderService.createReminder(userEmail, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(saved));
    }

    @GetMapping
    public ResponseEntity<List<ReminderResponse>> getActiveReminders(@AuthenticationPrincipal String userEmail) {
        List<Reminder> list = reminderService.getActiveRemindersForUser(userEmail);
        return ResponseEntity.ok(list.stream().map(this::toResponse).toList());
    }

    @GetMapping("/all")
    public ResponseEntity<List<ReminderResponse>> getAllReminders(@AuthenticationPrincipal String userEmail) {
        List<Reminder> list = reminderService.getAllRemindersForUser(userEmail);
        return ResponseEntity.ok(list.stream().map(this::toResponse).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReminderResponse> getReminder(@PathVariable Long id) {
        return ResponseEntity.ok(toResponse(reminderService.getReminderById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReminderResponse> updateReminder(@PathVariable Long id,
                                                           @Valid @RequestBody ReminderRequest request) {
        Reminder updated = reminderService.updateReminder(id, request);
        return ResponseEntity.ok(toResponse(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReminder(@PathVariable Long id) {
        reminderService.deleteReminder(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Void> toggleActive(@PathVariable Long id, @RequestParam boolean active) {
        reminderService.toggleActive(id, active);
        return ResponseEntity.noContent().build();
    }
}