package com.swastikai.medassist.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.swastikai.medassist.dto.AdherenceSummaryResponse;
import com.swastikai.medassist.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/adherence")
    public ResponseEntity<AdherenceSummaryResponse> getAdherence(
            @AuthenticationPrincipal String userEmail,
            @RequestParam(defaultValue = "30") int days) {

       
        if (days < 1) {
            days = 1;
        } else if (days > 365) {
            days = 365; 
        }

        AdherenceSummaryResponse response = dashboardService.getAdherenceSummary(userEmail, days);
        return ResponseEntity.ok(response);
    }
}