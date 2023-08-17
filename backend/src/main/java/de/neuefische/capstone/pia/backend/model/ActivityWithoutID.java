package de.neuefische.capstone.pia.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityWithoutID {

    private String name;
    private LocalDate activityDate;
    private String hobbyId;
    private int rating;
    private String color;
}
