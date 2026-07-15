package com.swastikai.medassist.repository;

import com.swastikai.medassist.model.Medicine;
import com.swastikai.medassist.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    List<Medicine> findByUser(User user);
    List<Medicine> findByUserAndNameContainingIgnoreCase(User user, String name);
}