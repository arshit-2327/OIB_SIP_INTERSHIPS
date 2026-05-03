package com.reservation.system.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "trains")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Train {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true, nullable = false)
    private String trainNumber;

    @NotBlank
    @Column(nullable = false)
    private String trainName;

    @NotBlank
    private String source;

    @NotBlank
    private String destination;

    private String departureTime;

    private String arrivalTime;

    private Integer totalSeats;

    private Integer availableSeats;
}