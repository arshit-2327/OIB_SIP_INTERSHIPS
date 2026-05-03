package com.reservation.system.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 10)
    private String pnr;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "train_id", nullable = false)
    private Train train;

    @NotBlank
    private String classType; // SLEEPER, AC, GENERAL

    @NotNull
    private LocalDate journeyDate;

    @NotBlank
    private String fromStation;

    @NotBlank
    private String toStation;

    private Integer numberOfPassengers;

    @Enumerated(EnumType.STRING)
    private ReservationStatus status;

    @Column(name = "booking_date")
    private LocalDateTime bookingDate;

    @Column(name = "cancellation_date")
    private LocalDateTime cancellationDate;

    @PrePersist
    protected void onCreate() {
        bookingDate = LocalDateTime.now();
        status = ReservationStatus.CONFIRMED;
        pnr = generatePNR();
    }

    private String generatePNR() {
        return "PNR" + System.currentTimeMillis();
    }

    public enum ReservationStatus {
        CONFIRMED, CANCELLED, WAITLIST
    }
}