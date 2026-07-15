package com.swastikai.medassist.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MedicineRequest {
    @NotBlank private String name;
    @NotBlank private String dosage;
    private String purpose;
    private String imageUrl;
}