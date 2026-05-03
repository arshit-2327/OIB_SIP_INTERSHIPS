package com.reservation.system.config;

import com.reservation.system.entity.Train;
import com.reservation.system.repository.TrainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final TrainRepository trainRepository;

    @Override
    public void run(String... args) {
        if (trainRepository.count() == 0) {
            trainRepository.save(createTrain("12301", "Howrah Rajdhani", "New Delhi", "Kolkata", "17:00", "09:30", 500, 500));
            trainRepository.save(createTrain("12302", "Kolkata Rajdhani", "Kolkata", "New Delhi", "16:55", "10:05", 500, 500));
            trainRepository.save(createTrain("12951", "Mumbai Rajdhani", "New Delhi", "Mumbai", "16:30", "08:35", 450, 450));
            trainRepository.save(createTrain("12952", "New Delhi Rajdhani", "Mumbai", "New Delhi", "17:05", "09:30", 450, 450));
            trainRepository.save(createTrain("12621", "Tamil Nadu Express", "New Delhi", "Chennai", "22:30", "07:05", 600, 600));
        }
    }

    private Train createTrain(String number, String name, String source, String destination,
                              String departure, String arrival, int total, int available) {
        Train train = new Train();
        train.setTrainNumber(number);
        train.setTrainName(name);
        train.setSource(source);
        train.setDestination(destination);
        train.setDepartureTime(departure);
        train.setArrivalTime(arrival);
        train.setTotalSeats(total);
        train.setAvailableSeats(available);
        return train;
    }
}