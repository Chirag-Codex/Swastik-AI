package com.swastikai.medassist.job;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.swastikai.medassist.model.DoseLog;
import com.swastikai.medassist.model.Reminder;
import com.swastikai.medassist.repository.DoseLogRepository;
import com.swastikai.medassist.repository.NotificationRepository;
import com.swastikai.medassist.repository.ReminderRepository;
import com.swastikai.medassist.service.NotificationService;

@Component
public class ReminderSchedulerJob {

    private static final Logger logger = LoggerFactory.getLogger(ReminderSchedulerJob.class);

    private final ReminderRepository reminderRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;
    private final DoseLogRepository doseLogRepository;

    public ReminderSchedulerJob(ReminderRepository reminderRepository,
                                NotificationRepository notificationRepository,
                                NotificationService notificationService,
                                DoseLogRepository doseLogRepository) {
        this.reminderRepository = reminderRepository;
        this.notificationRepository = notificationRepository;
        this.notificationService = notificationService;
        this.doseLogRepository = doseLogRepository;
    }

    @Scheduled(cron = "0 * * * * *") 
    public void processDueReminders() {
        logger.debug("Starting reminder scheduler run");

        LocalTime now = LocalTime.now().withSecond(0).withNano(0);
        LocalDate today = LocalDate.now();
        LocalDateTime nowDateTime = LocalDateTime.now();

        try {
            List<Reminder> dueReminders = reminderRepository.findByActiveTrueAndTime(now);

            if (dueReminders.isEmpty()) {
                logger.debug("No due reminders at {}", now);
                return;
            }

            logger.info("Found {} due reminders at {}", dueReminders.size(), now);

            int processedCount = 0;
            int skippedCount = 0;
            int errorCount = 0;

            for (Reminder reminder : dueReminders) {
                // Check if already sent today (This uses standard values, no lazy proxy loading needed)
                boolean alreadySent = notificationRepository.existsByReminderAndScheduledFor(
                        reminder, today
                );

                if (alreadySent) {
                    logger.debug("Reminder {} already sent today, skipping", reminder.getId());
                    skippedCount++;
                    continue;
                }

                try {
                
                    executeSingleReminderTransaction(reminder, nowDateTime);
                    processedCount++;
                } catch (Exception e) {
                    logger.error("Failed to process reminder {}: {}", reminder.getId(), e.getMessage(), e);
                    errorCount++;
                }
            }

            logger.info("Scheduler run completed: {} processed, {} skipped, {} errors",
                    processedCount, skippedCount, errorCount);

        } catch (Exception e) {
            logger.error("Critical error in reminder scheduler: {}", e.getMessage(), e);
        }
    }

   
    public void executeSingleReminderTransaction(Reminder reminder, LocalDateTime nowDateTime) {
        // Safe to call lazy loading objects inside the open session boundary!
        logger.info("Processing reminder {} for user {} at {}",
                reminder.getId(), reminder.getUser().getEmail(), nowDateTime.toLocalTime());

      
        DoseLog pendingLog = new DoseLog();
        pendingLog.setReminder(reminder);
        pendingLog.setScheduledTime(nowDateTime);
        pendingLog.setTakenAt(null);
        pendingLog.setStatus(DoseLog.Status.PENDING);

        doseLogRepository.save(pendingLog);
        logger.info("Created PENDING DoseLog for reminder {}", reminder.getId());

     
        notificationService.sendNotificationsForReminder(reminder);
    }

    @Scheduled(cron = "0 */15 * * * *")
    @Transactional
    public void sweepStalePendingDoses() {
       
    }
}