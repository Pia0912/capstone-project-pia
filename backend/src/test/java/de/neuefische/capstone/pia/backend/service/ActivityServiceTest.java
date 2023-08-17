package de.neuefische.capstone.pia.backend.service;

import de.neuefische.capstone.pia.backend.exceptions.NoSuchActivityException;
import de.neuefische.capstone.pia.backend.exceptions.NoSuchHobbyException;
import de.neuefische.capstone.pia.backend.model.Activity;
import de.neuefische.capstone.pia.backend.model.ActivityWithoutID;
import de.neuefische.capstone.pia.backend.model.Hobby;
import de.neuefische.capstone.pia.backend.model.UUIDService;
import de.neuefische.capstone.pia.backend.repo.HobbyRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ActivityServiceTest {

    private HobbyRepo hobbyRepo;
    private UUIDService uuidService;
    private ActivityService activityService;
    private HobbyService hobbyService;


    @BeforeEach
    public void setup() {
        hobbyRepo = mock(HobbyRepo.class);
        uuidService = mock(UUIDService.class);
        hobbyService = mock(HobbyService.class);
        activityService = new ActivityService(hobbyRepo, uuidService, hobbyService);
    }

    @Test
    void expectEmptyList_whenNoActivitiesExist() {
        // GIVEN
        String hobbyId = "existingHobbyId";
        Hobby existingHobby = new Hobby(hobbyId, "Gardening", "green", new ArrayList<>(), "user1");
        when(hobbyService.getHobbyById(hobbyId)).thenReturn(existingHobby);

        // WHEN
        List<Activity> activities = activityService.getActivitiesByHobbyId(hobbyId);

        // THEN
        verify(hobbyService).getHobbyById(hobbyId);
        assertEquals(new ArrayList<Activity>(), activities);
    }

    @Test
    void expectActivity_whenGetHobbyById() {
        // GIVEN
        String hobbyId = "existingHobbyId";
        String activityId = "existingActivityId";
        Activity existingActivity = new Activity(activityId, "Existing Activity", LocalDate.parse("2023-07-31"), hobbyId, 5, "green");

        Hobby existingHobby = new Hobby(hobbyId, "Gardening", "green", new ArrayList<>(List.of(existingActivity)), "user1");
        when(hobbyRepo.findById(hobbyId)).thenReturn(Optional.of(existingHobby));

        // WHEN
        Activity activity = activityService.getActivityByHobbyId(hobbyId, activityId);

        // THEN
        verify(hobbyRepo).findById(hobbyId);
        assertEquals(existingActivity, activity);
    }

    @Test
    void expectActivitiesList_whenGetActivityById() {
        // GIVEN
        String hobbyId = "existingHobbyId";
        String activityId1 = "existingActivityId1";
        Activity existingActivity1 = new Activity(activityId1, "Existing Activity 1", LocalDate.parse("2023-07-31"), hobbyId, 5, "green");

        String activityId2 = "existingActivityId2";
        Activity existingActivity2 = new Activity(activityId2, "Existing Activity 2", LocalDate.parse("2023-08-15"), hobbyId, 4, "blue");

        Hobby existingHobby = new Hobby(hobbyId, "Gardening", "green", new ArrayList<>(List.of(existingActivity1, existingActivity2)), "user1");
        when(hobbyRepo.findById(hobbyId)).thenReturn(Optional.of(existingHobby));

        // WHEN
        Activity activity1 = activityService.getActivityByHobbyId(hobbyId, activityId1);
        Activity activity2 = activityService.getActivityByHobbyId(hobbyId, activityId2);

        // THEN
        verify(hobbyRepo, times(2)).findById(hobbyId);
        assertEquals(existingActivity1, activity1);
        assertEquals(existingActivity2, activity2);
    }


    @Test
    void expectActivitiesToBeAddedToHobby_whenAddingActivityToHobby() {
        // GIVEN
        String hobbyId = "existingHobbyId";
        Hobby existingHobby = new Hobby(hobbyId, "Gardening", "green", new ArrayList<>(), "user1");

        String color = existingHobby.getColor();
        LocalDate activityDate = LocalDate.parse("2023-07-31");
        String generatedActivityId = "123";

        ActivityWithoutID newActivity = new ActivityWithoutID("New Activity", activityDate, null, 5, null);
        when(hobbyService.getHobbyById(hobbyId)).thenReturn(existingHobby);
        when(uuidService.getRandomId()).thenReturn(generatedActivityId);

        // WHEN
        Activity addedActivity = activityService.addActivityToHobby(hobbyId, newActivity, color);

        // THEN
        verify(hobbyService).getHobbyById(hobbyId);
        verify(uuidService).getRandomId();
        verify(hobbyRepo).save(existingHobby);

        // ALSO
        assertEquals(new Activity(generatedActivityId, "New Activity", activityDate, hobbyId, 5, "green"), addedActivity);
        assertTrue(existingHobby.getActivities().contains(addedActivity));
    }

    @Test
    void testUpdateActivity() {
        // GIVEN
        String hobbyId = "existingHobbyId";
        Hobby existingHobby = new Hobby(hobbyId, "Gardening", "green", new ArrayList<>(), "user1");

        String activityId = "existingActivityId";
        String updatedActivityName = "Updated Activity";
        LocalDate updatedActivityDate = LocalDate.parse("2023-08-01");
        int updatedRating = 4;

        ActivityWithoutID updatedActivity = new ActivityWithoutID(updatedActivityName, updatedActivityDate, hobbyId, updatedRating, "");

        Activity existingActivity = new Activity(activityId, "Existing Activity", LocalDate.now(), hobbyId, 5, "green");
        existingHobby.addActivity(existingActivity);

        when(hobbyService.getHobbyById(hobbyId)).thenReturn(existingHobby);
        when(hobbyRepo.findById(hobbyId)).thenReturn(Optional.of(existingHobby));
        when(uuidService.getRandomId()).thenReturn(activityId);
        when(hobbyRepo.save(existingHobby)).thenReturn(existingHobby);

        // WHEN
        Activity updated = activityService.updateActivity(hobbyId, activityId, updatedActivity);

        // THEN
        assertEquals(updatedActivityName, updated.getName());
        assertEquals(updatedActivityDate, updated.getActivityDate());
        assertEquals(updatedRating, updated.getRating());
        verify(hobbyRepo).save(existingHobby);
    }


    @Test
    void expectNoSuchActivityException_whenGetActivityIdNotFound() {
        // GIVEN
        String hobbyId = "existingHobbyId";
        String nonExistentActivityId = "abc";

        Hobby existingHobby = new Hobby(hobbyId, "Gardening", "green", new ArrayList<>(), "user1");
        when(hobbyRepo.findById(hobbyId)).thenReturn(Optional.of(existingHobby));

        // WHEN & THEN
        NoSuchActivityException exception = assertThrows(
                NoSuchActivityException.class,
                () -> activityService.getActivityByHobbyId(hobbyId, nonExistentActivityId)
        );
        assertEquals("Activity not found for ID: " + nonExistentActivityId, exception.getMessage());
    }

    @Test
    void expectDeleteActivityFromHobby_whenDeletingActivity() {
        // GIVEN
        String hobbyId = "existingHobbyId";
        String activityId = "existingActivityId";
        Activity existingActivity = new Activity(activityId, "Existing Activity", LocalDate.parse("2023-07-31"), hobbyId, 5, "green");

        Hobby existingHobby = new Hobby(hobbyId, "Gardening", "green", new ArrayList<>(List.of(existingActivity)), "user1");
        when(hobbyRepo.findById(hobbyId)).thenReturn(Optional.of(existingHobby));
        when(hobbyRepo.save(any(Hobby.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // WHEN
        activityService.deleteActivity(hobbyId, activityId);

        // THEN
        verify(hobbyRepo).findById(hobbyId);
        verify(hobbyRepo).save(existingHobby);
        assertEquals(0, existingHobby.getActivities().size());
    }

    @Test
    void expectNoSuchHobbyException_whenHobbyIdNotFoundInDeleteActivity() {
        // GIVEN
        String nonExistentHobbyId = "abc";
        String existingActivityId = "existingActivityId";
        when(hobbyRepo.findById(nonExistentHobbyId)).thenReturn(Optional.empty());

        // WHEN & THEN
        assertThrows(NoSuchHobbyException.class, () -> activityService.deleteActivity(nonExistentHobbyId, existingActivityId));
    }

    @Test
    void expectNoSuchActivityException_whenActivityIdNotFoundInDeleteActivity() {
        // GIVEN
        String hobbyId = "existingHobbyId";
        String nonExistentActivityId = "abc";
        Activity existingActivity = new Activity("existingActivityId", "Existing Activity", LocalDate.parse("2023-07-31"), hobbyId, 5, "green");

        Hobby existingHobby = new Hobby(hobbyId, "Gardening", "green", new ArrayList<>(List.of(existingActivity)), "user1");
        when(hobbyRepo.findById(hobbyId)).thenReturn(Optional.of(existingHobby));
        when(hobbyRepo.save(any(Hobby.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // WHEN & THEN
        assertThrows(NoSuchActivityException.class, () -> activityService.deleteActivity(hobbyId, nonExistentActivityId));
    }

    @Test
    void testGetActivityCounts() {
        // GIVEN
        Activity activity1 = new Activity("1", "Activity A", LocalDate.parse("2023-08-08"), "111", 1, "green");
        Activity activity2 = new Activity("2", "Activity B", LocalDate.parse("2023-07-09"), "222", 5, "green");
        Activity activity3 = new Activity("3", "Activity A", LocalDate.parse("2023-07-31"), "333", 3, "blue");
        List<Hobby> hobbies = Arrays.asList(
                new Hobby("h1", "Hobby 1", "green", Arrays.asList(activity1, activity2), "user1"),
                new Hobby("h2", "Hobby 2", "blue", List.of(activity3), "user1")
        );
        when(hobbyService.getHobbies()).thenReturn(hobbies);

        // WHEN
        Map<String, Long> result = activityService.getActivityCounts();

        // THEN
        Map<String, Long> expected = new HashMap<>();
        expected.put("Activity A", 2L);
        expected.put("Activity B", 1L);
        assertEquals(expected, result);
    }

    @Test
    void testGetMostAddedActivityName() {
        // GIVEN
        Activity activity1 = new Activity("1", "Activity A", LocalDate.parse("2023-08-08"), "111", 1, "green");
        Activity activity2 = new Activity("2", "Activity B", LocalDate.parse("2023-07-09"), "222", 5, "green");
        Activity activity3 = new Activity("3", "Activity A", LocalDate.parse("2023-07-31"), "333", 3, "blue");
        List<Hobby> hobbies = Arrays.asList(
                new Hobby("h1", "Hobby 1", "green", Arrays.asList(activity1, activity2), "user1"),
                new Hobby("h2", "Hobby 2", "blue", List.of(activity3), "user1")
        );
        when(hobbyService.getHobbies()).thenReturn(hobbies);

        // WHEN
        String result = activityService.getMostAddedActivityName();

        // THEN
        assertEquals("Activity A", result);
    }

    @Test
    void testGetActivityDays() {
        // GIVEN
        Activity activity1 = new Activity("1", "Activity A", LocalDate.parse("2023-08-07"), "111", 1, "green");
        Activity activity2 = new Activity("2", "Activity B", LocalDate.parse("2023-07-09"), "222", 5, "green");
        Activity activity3 = new Activity("3", "Activity A", LocalDate.parse("2023-08-14"), "333", 3, "blue");
        List<Hobby> hobbies = Arrays.asList(
                new Hobby("h1", "Hobby 1", "green", Arrays.asList(activity1, activity2), "user1"),
                new Hobby("h2", "Hobby 2", "blue", List.of(activity3), "user1")
        );
        when(hobbyService.getHobbies()).thenReturn(hobbies);

        // WHEN
        Map<String, Long> result = activityService.getActivityDays();

        // THEN
        Map<String, Long> expected = new HashMap<>();
        expected.put("MONDAY", 2L);
        expected.put("SUNDAY", 1L);
        assertEquals(expected, result);
    }
}
