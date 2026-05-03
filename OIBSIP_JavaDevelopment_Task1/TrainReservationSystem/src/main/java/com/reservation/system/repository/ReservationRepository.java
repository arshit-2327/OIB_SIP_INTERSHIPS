package com.reservation.system.repository;

import com.reservation.system.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Optional<Reservation> findByPnr(String pnr);
    boolean existsByPnr(String pnr);
    List<Reservation> findByUserId(Long userId);
    List<Reservation> findByTrainId(Long trainId);
    List<Reservation> findByStatus(Reservation.ReservationStatus status);
}
