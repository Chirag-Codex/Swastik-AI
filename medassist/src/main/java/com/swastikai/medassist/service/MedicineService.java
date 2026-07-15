package com.swastikai.medassist.service;

import com.swastikai.medassist.dto.MedicineRequest;
import com.swastikai.medassist.model.Medicine;
import com.swastikai.medassist.model.User;
import com.swastikai.medassist.repository.MedicineRepository;
import com.swastikai.medassist.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicineService {

    private final MedicineRepository medicineRepository;
    private final UserRepository userRepository;

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Transactional
    public Medicine createMedicine(String userEmail, MedicineRequest request) {
        User user = getUserByEmail(userEmail);
        Medicine medicine = new Medicine();
        medicine.setUser(user);
        medicine.setName(request.getName());
        medicine.setDosage(request.getDosage());
        medicine.setPurpose(request.getPurpose());
        medicine.setImageUrl(request.getImageUrl());
        return medicineRepository.save(medicine);
    }

    public List<Medicine> getMedicinesForUser(String userEmail) {
        return medicineRepository.findByUser(getUserByEmail(userEmail));
    }

    public Medicine getMedicineById(Long id) {
        return medicineRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Medicine not found"));
    }

    @Transactional
    public Medicine updateMedicine(Long id, MedicineRequest request) {
        Medicine medicine = getMedicineById(id);
        medicine.setName(request.getName());
        medicine.setDosage(request.getDosage());
        medicine.setPurpose(request.getPurpose());
        medicine.setImageUrl(request.getImageUrl());
        return medicineRepository.save(medicine);
    }

    @Transactional
    public void deleteMedicine(Long id) {
        medicineRepository.deleteById(id);
    }

    public List<Medicine> searchMedicinesByName(String userEmail, String name) {
        return medicineRepository.findByUserAndNameContainingIgnoreCase(getUserByEmail(userEmail), name);
    }
}