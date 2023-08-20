package de.neuefische.capstone.pia.backend.service;

import de.neuefische.capstone.pia.backend.model.Activity;
import de.neuefische.capstone.pia.backend.model.Hobby;
import de.neuefische.capstone.pia.backend.repo.HobbyRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


class CalendarServiceTest {

    private HobbyService hobbyService;
    private CalendarService calendarService;

    @BeforeEach
    public void setup() {
        hobbyService = mock(HobbyService.class);
        calendarService = new CalendarService(hobbyService);
    }

    @Test
    void testGetActivitiesByMonthWithNullPointerException() {
        // GIVEN
        HobbyRepo hobbyRepo = mock(HobbyRepo.class);
        Hobby hobbyWithNullActivities = new Hobby("h1", "Hobby 1", "green", null, "user1");
        when(hobbyRepo.findAll()).thenReturn(Collections.singletonList(hobbyWithNullActivities));

        // WHEN & THEN
        assertDoesNotThrow(() -> {
            calendarService.getActivitiesByMonth(LocalDate.of(2023, 7, 1));
        });
    }

    @Test
    void testGetActivitiesByMonth_ReturnsEmptyList_WhenNoHobbies() {
       //WHEN
        when(hobbyService.getHobbies()).thenReturn(new ArrayList<>());

        // THEN
        List<Activity> activities = calendarService.getActivitiesByMonth(LocalDate.of(2023, 8, 1));

        assertTrue(activities.isEmpty());
        verify(hobbyService, times(1)).getHobbies();
    }

    @Test
    void testGetActivitiesByMonth_ReturnsActivitiesWithColor_WhenMatchingMonthAndYear() {
        // GIVEN
        String hobbyId = "existingHobbyId";
        String activityId = "existingActivityId";
        Activity existingActivity = new Activity(activityId, "Existing Activity", LocalDate.parse("2023-08-15"), hobbyId, 5, "green");

        Hobby existingHobby = new Hobby(hobbyId, "Gardening", "green", new ArrayList<>(List.of(existingActivity)), "user1");

        List<Hobby> hobbies = new ArrayList<>();
        hobbies.add(existingHobby);

        // WHEN
        when(hobbyService.getHobbies()).thenReturn(hobbies);

        List<Activity> activities = calendarService.getActivitiesByMonth(LocalDate.of(2023, 8, 1));

        // THEN
        assertFalse(activities.isEmpty());
        assertEquals(1, activities.size());
        assertEquals(activityId, activities.get(0).getActivityId());
        assertEquals(LocalDate.of(2023, 8, 15), activities.get(0).getActivityDate());
        assertEquals("green", activities.get(0).getColor());
        assertEquals(hobbyId, activities.get(0).getHobbyId());
        assertEquals(5, activities.get(0).getRating());
        assertEquals("Existing Activity", activities.get(0).getName());
        verify(hobbyService, times(1)).getHobbies();
    }

    @Test
    void testGetActivitiesByMonth_ReturnsEmptyList_WhenNoMatchingActivities() {
        // GIVEN
        List<Hobby> hobbies = new ArrayList<>();
        Hobby hobby = new Hobby();
        hobby.setHobbyId("hobbyId");
        hobby.setColor("blue");
        Activity activity = new Activity();
        activity.setActivityId("activityId");
        activity.setActivityDate(LocalDate.of(2023, 8, 15));
        activity.setRating(5);
        activity.setName("Example Activity");
        hobby.setActivities(List.of(activity));
        hobbies.add(hobby);

        // WHEN
        when(hobbyService.getHobbies()).thenReturn(hobbies);

        // THEN
        List<Activity> activities = calendarService.getActivitiesByMonth(LocalDate.of(2023, 7, 1));

        assertTrue(activities.isEmpty());
        verify(hobbyService, times(1)).getHobbies();
    }
}
