package com.swastikai.medassist.dto;

import java.util.List;

public record AdherenceSummaryResponse(
        double onTimeRate,
        double overallAdherenceRate,
        long totalScheduled,
        long totalTaken,
        long totalLate,
        long totalMissed,
        List<AdherenceDayStat> dailyBreakdown
) {}