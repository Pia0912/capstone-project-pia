package de.neuefische.capstone.pia.backend.model;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
class HobbyTest {

    @Test
    void addActivity_addsActivityToList() {
        // GIVEN
        Hobby hobby = new Hobby("1", "Gardening", new ArrayList<>());
        Activity activity = new Activity("activityId", "Planting Flowers", LocalDate.parse("2023-07-31"), "1", 5);

        // WHEN
        hobby.addActivity(activity);

        // THEN
        List<Activity> expectedActivities = new ArrayList<>(List.of(activity));
        assertEquals(expectedActivities, hobby.getActivities());
    }

    @Test
    void removeActivity_deletesActivityFromList() {
        // GIVEN
        Hobby hobby = new Hobby("1", "Gardening", new ArrayList<>());
        Activity activity1 = new Activity("activityId1", "Planting Flowers", LocalDate.parse("2023-07-31"), "1", 5);
        Activity activity2 = new Activity("activityId2", "Watering Flowers", LocalDate.parse("2023-08-01"), "1", 4);
        hobby.addActivity(activity1);
        hobby.addActivity(activity2);

        // WHEN
        hobby.removeActivity(activity1);

        // THEN
        List<Activity> expectedActivities = new ArrayList<>(List.of(activity2));
        assertEquals(expectedActivities, hobby.getActivities());
    }

    @Test
    void removeActivity_ShouldNotModifyListWhenActivityNotPresent() {
        // GIVEN
        Hobby hobby = new Hobby("1", "Gardening", new ArrayList<>());
        Activity activity1 = new Activity("activityId1", "Planting Flowers", LocalDate.parse("2023-07-31"), "1", 5);
        Activity activity2 = new Activity("activityId2", "Watering Flowers", LocalDate.parse("2023-08-01"), "1", 4);
        hobby.addActivity(activity1);

        // WHEN
        hobby.removeActivity(activity2);

        // THEN
        List<Activity> expectedActivities = new ArrayList<>(List.of(activity1));
        assertEquals(expectedActivities, hobby.getActivities());
    }

}
