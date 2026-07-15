package com.swastikai.medassist.repository;

import com.swastikai.medassist.model.Notification;
import com.swastikai.medassist.model.Reminder;
import com.swastikai.medassist.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    boolean existsByReminderAndScheduledFor(Reminder reminder, LocalDate scheduledFor);

    @Query("SELECT COUNT(n) > 0 FROM Notification n WHERE n.reminder = :reminder AND n.scheduledFor = :scheduledFor AND n.channel = :channel")
    boolean existsByReminderAndScheduledForAndChannel(
            @Param("reminder") Reminder reminder,
            @Param("scheduledFor") LocalDate scheduledFor,
            @Param("channel") Notification.Channel channel
    );

    List<Notification> findByUserAndReadFlagFalseOrderByCreatedAtDesc(User user);

    long countByUserAndReadFlagFalse(User user);
}