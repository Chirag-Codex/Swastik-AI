package com.swastikai.medassist.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class MedicineResponse {
    private Long id;
    private String name;
    private String dosage;
    private String purpose;
    private String imageUrl;
    private LocalDateTime createdAt;
}