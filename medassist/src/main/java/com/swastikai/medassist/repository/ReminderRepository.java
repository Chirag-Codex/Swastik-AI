package com.swastikai.medassist.repository;

import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.swastikai.medassist.model.Reminder;
import com.swastikai.medassist.model.User;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {

   
    List<Reminder> findByUserAndActiveTrue(User user);

    List<Reminder> findByUser(User user);


    List<Reminder> findByActiveTrue();

   
    List<Reminder> findByActiveTrueAndTime(LocalTime time);


   
    List<Reminder> findByUserAndActiveTrueOrderByTimeAsc(User user);

    long countByUserAndActiveTrue(User user);

    List<Reminder> findByMedicineId(Long medicineId);

   
    @Query("SELECT r FROM Reminder r WHERE r.active = true AND r.time = :time")
    List<Reminder> findAllActiveByTime(@Param("time") LocalTime time);

    @Query("SELECT r FROM Reminder r WHERE r.user = :user AND r.active = true AND r.time = :time")
    List<Reminder> findByUserAndActiveTrueAndTime(@Param("user") User user, @Param("time") LocalTime time);
}