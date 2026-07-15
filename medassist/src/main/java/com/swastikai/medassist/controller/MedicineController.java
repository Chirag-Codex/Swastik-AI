package com.swastikai.medassist.controller;

import com.swastikai.medassist.dto.MedicineRequest;
import com.swastikai.medassist.dto.MedicineResponse;
import com.swastikai.medassist.model.Medicine;
import com.swastikai.medassist.service.MedicineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@RequiredArgsConstructor
public class MedicineController {

    private final MedicineService medicineService;

    private MedicineResponse toResponse(Medicine m) {
        return new MedicineResponse(m.getId(), m.getName(), m.getDosage(),
                m.getPurpose(), m.getImageUrl(), m.getCreatedAt());
    }

    @PostMapping
    public ResponseEntity<MedicineResponse> createMedicine(@AuthenticationPrincipal String userEmail,
                                                           @Valid @RequestBody MedicineRequest request) {
        Medicine saved = medicineService.createMedicine(userEmail, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(saved));
    }

    @GetMapping
    public ResponseEntity<List<MedicineResponse>> getMedicines(@AuthenticationPrincipal String userEmail) {
        List<Medicine> list = medicineService.getMedicinesForUser(userEmail);
        return ResponseEntity.ok(list.stream().map(this::toResponse).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicineResponse> getMedicine(@PathVariable Long id) {
        return ResponseEntity.ok(toResponse(medicineService.getMedicineById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicineResponse> updateMedicine(@PathVariable Long id,
                                                           @Valid @RequestBody MedicineRequest request) {
        Medicine updated = medicineService.updateMedicine(id, request);
        return ResponseEntity.ok(toResponse(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicine(@PathVariable Long id) {
        medicineService.deleteMedicine(id);
        return ResponseEntity.noContent().build();
    }
}