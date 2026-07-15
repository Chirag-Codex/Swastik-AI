package com.swastikai.medassist.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "dose_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoseLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reminder_id", nullable = false)
    private Reminder reminder;

    @Column(nullable = false)
    private LocalDateTime scheduledTime;

    private LocalDateTime takenAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    public enum Status {
        PENDING,   // Waiting for user response
        TAKEN,     // Taken on time
        LATE,      // Taken late (after grace period)
        MISSED     // Never taken
    }
}