package com.swastikai.medassist.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.swastikai.medassist.dto.AdherenceDayStat;
import com.swastikai.medassist.dto.AdherenceSummaryResponse;
import com.swastikai.medassist.model.DoseLog;
import com.swastikai.medassist.repository.DoseLogRepository;

@Service
public class DashboardService {

    private final DoseLogRepository doseLogRepository;

    public DashboardService(DoseLogRepository doseLogRepository) {
        this.doseLogRepository = doseLogRepository;
    }

    public AdherenceSummaryResponse getAdherenceSummary(String userEmail, int days) {
      
        LocalDate startDate = LocalDate.now().minusDays(days);
        LocalDateTime startDateTime = startDate.atStartOfDay();

        List<Object[]> rawStats = doseLogRepository.getDailyStatusCounts(userEmail, startDateTime);

        Map<LocalDate, Map<DoseLog.Status, Long>> dailyStats = new HashMap<>();

        for (Object[] row : rawStats) {
            LocalDate date = ((java.sql.Date) row[0]).toLocalDate();
            DoseLog.Status status = parseStatus(row[1]);
            Long count = (Long) row[2];

            dailyStats.computeIfAbsent(date, k -> new HashMap<>())
                    .put(status, count);
        }

        List<AdherenceDayStat> dailyBreakdown = new ArrayList<>();
        long totalTaken = 0;
        long totalLate = 0;
        long totalMissed = 0;

        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            Map<DoseLog.Status, Long> dayStat = dailyStats.getOrDefault(date, new HashMap<>());

            long taken = dayStat.getOrDefault(DoseLog.Status.TAKEN, 0L);
            long late = dayStat.getOrDefault(DoseLog.Status.LATE, 0L);
            long missed = dayStat.getOrDefault(DoseLog.Status.MISSED, 0L);
            long total = taken + late + missed;

            totalTaken += taken;
            totalLate += late;
            totalMissed += missed;

            double onTimeRate = total > 0 ? (double) taken / total : 0.0;
            double overallAdherenceRate = total > 0 ? (double) (taken + late) / total : 0.0;

            dailyBreakdown.add(new AdherenceDayStat(
                    date,
                    taken,
                    late,
                    missed,
                    onTimeRate,
                    overallAdherenceRate
            ));
        }

        long totalScheduled = totalTaken + totalLate + totalMissed;
        double onTimeRate = totalScheduled > 0 ? (double) totalTaken / totalScheduled : 0.0;
        double overallAdherenceRate = totalScheduled > 0 ? (double) (totalTaken + totalLate) / totalScheduled : 0.0;

        return new AdherenceSummaryResponse(
                onTimeRate,
                overallAdherenceRate,
                totalScheduled,
                totalTaken,
                totalLate,
                totalMissed,
                dailyBreakdown
        );
    }

    private DoseLog.Status parseStatus(Object statusValue) {
        if (statusValue instanceof DoseLog.Status status) {
            return status;
        }
        if (statusValue instanceof String statusText) {
            return DoseLog.Status.valueOf(statusText.toUpperCase(Locale.ROOT));
        }
        throw new IllegalArgumentException("Unsupported dose log status value: " + statusValue);
    }
}