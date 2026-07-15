package com.swastikai.medassist.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.swastikai.medassist.model.DoseLog;
import com.swastikai.medassist.model.Reminder;

@Repository
public interface DoseLogRepository extends JpaRepository<DoseLog, Long> {

    List<DoseLog> findByReminder(Reminder reminder);

   
    Optional<DoseLog> findByReminderAndStatusAndScheduledTimeBetween(
            Reminder reminder,
            DoseLog.Status status,
            LocalDateTime start,
            LocalDateTime end
    );

   
    @Query("SELECT d FROM DoseLog d WHERE d.status = 'PENDING' AND d.scheduledTime < :cutoffTime")
    List<DoseLog> findPendingOlderThan(@Param("cutoffTime") LocalDateTime cutoffTime);

   
    @Query("""
        SELECT FUNCTION('DATE', d.scheduledTime), d.status, COUNT(d)
        FROM DoseLog d
        WHERE d.reminder.user.email = :email
          AND d.scheduledTime >= :startDate
          AND d.status != 'PENDING'
        GROUP BY FUNCTION('DATE', d.scheduledTime), d.status
        """)
    List<Object[]> getDailyStatusCounts(
            @Param("email") String email,
            @Param("startDate") LocalDateTime startDate
    );

   
    @Query("""
        SELECT COUNT(d) 
        FROM DoseLog d 
        WHERE d.reminder.user.email = :email 
          AND d.scheduledTime >= :startDate 
          AND d.status != 'PENDING'
        """)
    long countTotalScheduled(
            @Param("email") String email,
            @Param("startDate") LocalDateTime startDate
    );

  
    @Query("""
        SELECT COUNT(d) 
        FROM DoseLog d 
        WHERE d.reminder.user.email = :email 
          AND d.scheduledTime >= :startDate 
          AND d.status = :status
        """)
    long countByStatus(
            @Param("email") String email,
            @Param("startDate") LocalDateTime startDate,
            @Param("status") DoseLog.Status status
    );

   
    Optional<DoseLog> findFirstByReminderAndStatusOrderByScheduledTimeDesc(
            Reminder reminder,
            DoseLog.Status status
    );
}