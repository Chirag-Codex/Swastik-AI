package com.swastikai.medassist.service;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.swastikai.medassist.dto.AdherenceSummaryResponse;
import com.swastikai.medassist.model.DoseLog;
import com.swastikai.medassist.repository.DoseLogRepository;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private DoseLogRepository doseLogRepository;

    @InjectMocks
    private DashboardService dashboardService;

    @Test
    void getAdherenceSummary_handlesEnumStatusesReturnedByRepository() {
        when(doseLogRepository.getDailyStatusCounts(eq("user@example.com"), any(LocalDateTime.class)))
                .thenReturn(List.of(
                        new Object[]{Date.valueOf(LocalDate.now()), DoseLog.Status.TAKEN, 1L},
                        new Object[]{Date.valueOf(LocalDate.now()), DoseLog.Status.LATE, 1L}
                ));

        AdherenceSummaryResponse response = assertDoesNotThrow(() ->
                dashboardService.getAdherenceSummary("user@example.com", 1));

        assertEquals(2L, response.totalScheduled());
        assertEquals(1L, response.totalTaken());
        assertEquals(1L, response.totalLate());
    }
}
