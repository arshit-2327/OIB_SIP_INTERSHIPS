package com.reservation.system.controller;

import com.reservation.system.dto.ReservationRequest;
import com.reservation.system.dto.ReservationResponse;
import com.reservation.system.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservations")
//@CrossOrigin(origins = "http://localhost:5174")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(
            @Valid @RequestBody ReservationRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        ReservationResponse response = reservationService.createReservation(request, username);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{pnr}")
    public ResponseEntity<ReservationResponse> getReservation(@PathVariable String pnr) {
        ReservationResponse response = reservationService.getReservationByPnr(pnr);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{pnr}")
    public ResponseEntity<String> cancelReservation(@PathVariable String pnr) {
        String response = reservationService.cancelReservation(pnr);
        return ResponseEntity.ok(response);
    }
}