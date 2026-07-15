package com.swastikai.medassist.service.ai;

import com.swastikai.medassist.dto.MedicineRequest;
import com.swastikai.medassist.service.MedicineService;
import com.swastikai.medassist.service.WebSearchService;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class MedicineTools {

    private final MedicineService medicineService;
    private final WebSearchService webSearchService;

    public MedicineTools(MedicineService medicineService, WebSearchService webSearchService) {
        this.medicineService = medicineService;
        this.webSearchService = webSearchService;
    }

    private String getCurrentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @Tool(description = "Look up detailed, current information about a medicine from the web — " +
            "its purpose, typical dosage, timing, and precautions. Use this whenever a user asks " +
            "what a medicine is, what it's for, or how to take it.")
    public String getMedicineInfo(String medicineName) {
        try {
            var response = webSearchService.search(
                    medicineName + " medicine uses dosage timing precautions side effects", 4);

            StringBuilder sb = new StringBuilder();
            if (response.answer() != null && !response.answer().isBlank()) {
                sb.append(response.answer()).append("\n\n");
            }
            if (response.results() != null) {
                for (var r : response.results()) {
                    sb.append("- ").append(r.title()).append(": ").append(r.content()).append("\n");
                }
            }
            return sb.isEmpty()
                    ? "No reliable information found online for '" + medicineName + "'."
                    : sb.toString();
        } catch (Exception e) {
            return "Web lookup failed for '" + medicineName + "': " + e.getMessage();
        }
    }

    @Tool(description = "Add a new medicine to the user's personal list, used for setting reminders.")
    public String addMedicine(String name, String dosage, String purpose) {
        String userEmail = getCurrentUserEmail();
        try {
            MedicineRequest request = new MedicineRequest();
            request.setName(name);
            request.setDosage(dosage);
            request.setPurpose(purpose);
            medicineService.createMedicine(userEmail, request);
            return "Medicine '" + name + "' added successfully.";
        } catch (Exception e) {
            return "Failed to add medicine: " + e.getMessage();
        }
    }
}