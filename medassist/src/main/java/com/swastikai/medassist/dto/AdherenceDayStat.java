package com.swastikai.medassist.dto;

import java.time.LocalDate;

public record AdherenceDayStat(
        LocalDate date,
        long taken,
        long late,
        long missed,
        double onTimeRate,
        double overallAdherenceRate
) {}