package com.swastikai.medassist.controller;

import com.swastikai.medassist.dto.DoseLogResponse;
import com.swastikai.medassist.model.DoseLog;
import com.swastikai.medassist.service.DoseLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/doselogs")
@RequiredArgsConstructor
public class DoseLogController {

    private final DoseLogService doseLogService;

    private DoseLogResponse toResponse(DoseLog log) {
        return new DoseLogResponse(
                log.getId(),
                log.getReminder().getId(),
                log.getReminder().getMedicine().getName(),
                log.getScheduledTime(),
                log.getTakenAt(),
                log.getStatus().name()
        );
    }

    @PostMapping
    public ResponseEntity<DoseLogResponse> logDose(@RequestParam Long reminderId,
                                                   @RequestParam boolean taken,
                                                   @RequestParam(defaultValue = "false") boolean late) {
        DoseLog saved = doseLogService.logDose(reminderId, taken, late);
        return ResponseEntity.ok(toResponse(saved));
    }

    @GetMapping
    public ResponseEntity<List<DoseLogResponse>> getDoseLogs(@AuthenticationPrincipal String userEmail) {
        List<DoseLog> logs = doseLogService.getDoseLogsForUser(userEmail);
        return ResponseEntity.ok(logs.stream().map(this::toResponse).toList());
    }
}