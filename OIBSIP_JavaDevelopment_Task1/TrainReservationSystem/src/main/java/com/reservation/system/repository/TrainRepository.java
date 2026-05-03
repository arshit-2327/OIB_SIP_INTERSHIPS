package com.reservation.system.repository;

import com.reservation.system.entity.Train;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrainRepository extends JpaRepository<Train, Long> {
    Optional<Train> findByTrainNumber(String trainNumber);
    boolean existsByTrainNumber(String trainNumber);
    List<Train> findBySourceAndDestination(String source, String destination);
}
