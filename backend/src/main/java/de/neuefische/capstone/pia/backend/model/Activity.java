package de.neuefische.capstone.pia.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Activity {
    private String activityId;
    private String name;
    private LocalDate activityDate;
    @Field("hobbyId")
    private String hobbyId;
    private int rating;
}
