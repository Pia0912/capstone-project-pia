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

    HobbyService hobbyService;
    CalendarService calendarService;
    HobbyRepo hobbyRepo;

    @BeforeEach
    public void setup() {
        hobbyService = mock(HobbyService.class);
        hobbyRepo = mock(HobbyRepo.class);
        calendarService = new CalendarService(hobbyService);
    }

    @Test
    void testGetActivitiesByMonthWithNullPointerException() {
        // GIVEN
        HobbyRepo hobbyRepo = mock(HobbyRepo.class);
        Hobby hobbyWithNullActivities = new Hobby("h1", "Hobby 1", "green", null);
        when(hobbyRepo.findAll()).thenReturn(Collections.singletonList(hobbyWithNullActivities));

        // WHEN & THEN
        assertDoesNotThrow(() -> {
            calendarService.getActivitiesByMonth(LocalDate.of(2023, 7, 1));
        });
    }


    @Test
    void testGetActivitiesByMonth_ReturnsEmptyList_WhenNoHobbies() {
        // Arrange
        when(hobbyService.getHobbies()).thenReturn(new ArrayList<>());

        // Act
        List<Activity> activities = calendarService.getActivitiesByMonth(LocalDate.of(2023, 8, 1));

        // Assert
        assertTrue(activities.isEmpty());
        verify(hobbyService, times(1)).getHobbies();
    }

    @Test
    void testGetActivitiesByMonth_ReturnsActivitiesWithColor_WhenMatchingMonthAndYear() {
        // Arrange
        List<Hobby> hobbies = new ArrayList<>();
        Hobby hobby = new Hobby();
        hobby.setHobbyId("hobbyId");
        hobby.setColor("red");
        Activity activity = new Activity();
        activity.setActivityId("activityId");
        activity.setActivityDate(LocalDate.of(2023, 8, 15));
        activity.setRating(5);
        activity.setName("Example Activity");
        hobby.setActivities(List.of(activity));
        hobbies.add(hobby);

        when(hobbyService.getHobbies()).thenReturn(hobbies);

        // Act
        List<Activity> activities = calendarService.getActivitiesByMonth(LocalDate.of(2023, 8, 1));

        // Assert
        assertFalse(activities.isEmpty());
        assertEquals(1, activities.size());
        assertEquals("activityId", activities.get(0).getActivityId());
        assertEquals(LocalDate.of(2023, 8, 15), activities.get(0).getActivityDate());
        assertEquals("red", activities.get(0).getColor());
        assertEquals("hobbyId", activities.get(0).getHobbyId());
        assertEquals(5, activities.get(0).getRating());
        assertEquals("Example Activity", activities.get(0).getName());
        verify(hobbyService, times(1)).getHobbies();
    }

    @Test
    void testGetActivitiesByMonth_ReturnsEmptyList_WhenNoMatchingActivities() {
        // Arrange
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

        when(hobbyService.getHobbies()).thenReturn(hobbies);

        // Act
        List<Activity> activities = calendarService.getActivitiesByMonth(LocalDate.of(2023, 7, 1));

        // Assert
        assertTrue(activities.isEmpty());
        verify(hobbyService, times(1)).getHobbies();
    }
}
