package com.reservation.system.service;

import com.reservation.system.dto.ReservationRequest;
import com.reservation.system.dto.ReservationResponse;
import com.reservation.system.entity.Reservation;
import com.reservation.system.entity.Train;
import com.reservation.system.entity.User;
import com.reservation.system.repository.ReservationRepository;
import com.reservation.system.repository.TrainRepository;
import com.reservation.system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final TrainRepository trainRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReservationResponse createReservation(ReservationRequest request, String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Train train = trainRepository.findByTrainNumber(request.getTrainNumber())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Train not found"));

        if (train.getAvailableSeats() < request.getNumberOfPassengers()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient seats available");
        }

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setTrain(train);
        reservation.setClassType(request.getClassType());
        reservation.setJourneyDate(request.getJourneyDate());
        reservation.setFromStation(request.getFromStation());
        reservation.setToStation(request.getToStation());
        reservation.setNumberOfPassengers(request.getNumberOfPassengers());

        // Update available seats
        train.setAvailableSeats(train.getAvailableSeats() - request.getNumberOfPassengers());
        trainRepository.save(train);

        Reservation saved = reservationRepository.save(reservation);

        return mapToResponse(saved);
    }

    public ReservationResponse getReservationByPnr(String pnr) {
        Reservation reservation = reservationRepository.findByPnr(pnr)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation not found"));

        return mapToResponse(reservation);
    }

    @Transactional
    public String cancelReservation(String pnr) {
        Reservation reservation = reservationRepository.findByPnr(pnr)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        if (reservation.getStatus() == Reservation.ReservationStatus.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reservation already cancelled");
        }

        reservation.setStatus(Reservation.ReservationStatus.CANCELLED);
        reservation.setCancellationDate(LocalDateTime.now());

        // Restore seats
        Train train = reservation.getTrain();
        train.setAvailableSeats(train.getAvailableSeats() + reservation.getNumberOfPassengers());
        trainRepository.save(train);

        reservationRepository.save(reservation);

        return "Reservation cancelled successfully";
    }

    private ReservationResponse mapToResponse(Reservation reservation) {
        return new ReservationResponse(
                reservation.getPnr(),
                reservation.getTrain().getTrainNumber(),
                reservation.getTrain().getTrainName(),
                reservation.getClassType(),
                reservation.getJourneyDate(),
                reservation.getFromStation(),
                reservation.getToStation(),
                reservation.getNumberOfPassengers(),
                reservation.getStatus().toString(),
                reservation.getBookingDate()
        );
    }
}