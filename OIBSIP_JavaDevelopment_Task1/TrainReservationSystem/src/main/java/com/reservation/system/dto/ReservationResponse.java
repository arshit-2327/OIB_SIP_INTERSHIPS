package com.reservation.system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ReservationResponse {
    private String pnr;
    private String trainNumber;
    private String trainName;
    private String classType;
    private LocalDate journeyDate;
    private String fromStation;
    private String toStation;
    private Integer numberOfPassengers;
    private String status;
    private LocalDateTime bookingDate;
}