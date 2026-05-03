package com.reservation.system.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ReservationRequest {
    @NotBlank
    private String trainNumber;

    @NotBlank
    private String classType;

    @NotNull
    private LocalDate journeyDate;

    @NotBlank
    private String fromStation;

    @NotBlank
    private String toStation;

    @NotNull
    private Integer numberOfPassengers;
}