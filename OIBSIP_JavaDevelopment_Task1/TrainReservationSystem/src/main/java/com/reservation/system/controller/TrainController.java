package com.reservation.system.controller;

import com.reservation.system.entity.Train;
import com.reservation.system.repository.TrainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trains")
//@CrossOrigin(origins = "http://localhost:5174")
@RequiredArgsConstructor
public class TrainController {

    private final TrainRepository trainRepository;

    @GetMapping
    public ResponseEntity<List<Train>> getAllTrains() {
        return ResponseEntity.ok(trainRepository.findAll());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Train>> searchTrains(
            @RequestParam String source,
            @RequestParam String destination) {
        List<Train> trains = trainRepository.findBySourceAndDestination(source, destination);
        return ResponseEntity.ok(trains);
    }

    @GetMapping("/{trainNumber}")
    public ResponseEntity<Train> getTrainByNumber(@PathVariable String trainNumber) {
        Train train = trainRepository.findByTrainNumber(trainNumber)
                .orElseThrow(() -> new RuntimeException("Train not found"));
        return ResponseEntity.ok(train);
    }
}