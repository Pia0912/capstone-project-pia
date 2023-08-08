package de.neuefische.capstone.pia.backend.service;

import de.neuefische.capstone.pia.backend.exceptions.NoSuchActivityException;
import de.neuefische.capstone.pia.backend.exceptions.NoSuchHobbyException;
import de.neuefische.capstone.pia.backend.model.*;
import de.neuefische.capstone.pia.backend.repo.HobbyRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class HobbyServiceTest {

    HobbyRepo hobbyRepo;
    UUIDService uuidService;
    HobbyService hobbyService;
    @BeforeEach
    public void setup() {
        hobbyRepo = mock(HobbyRepo.class);
        uuidService = mock(UUIDService.class);
        hobbyService = new HobbyService(hobbyRepo, uuidService);
    }
    @Test
    void expectEmptyList_whenNoHobbiesExist() {
        // GIVEN
        when(hobbyRepo.findAll()).thenReturn(Collections.emptyList());

        // WHEN
        List<Hobby> actual = hobbyService.getHobbies();

        // THEN
        assertEquals(Collections.emptyList(), actual);
        verify(hobbyRepo).findAll();
    }

    @Test
    void expectListOfAllParties_whenGettingTheList() {
        //GIVEN
        Hobby newHobby = new Hobby(null, "Gardening", "green", new ArrayList<>());
        List<Hobby> expected = new ArrayList<>(List.of(newHobby));

        //WHEN
        when(hobbyRepo.findAll()).thenReturn(expected);
        List<Hobby> actual = hobbyService.getHobbies();

        //THEN
        assertEquals(expected, actual);
        verify(hobbyRepo).findAll();
    }


    @Test
    void expectId_whenAddedHobby() {
        // GIVEN
        HobbyWithoutID newHobbyNoId = new HobbyWithoutID("gardening", "green");
        Hobby expected = new Hobby("abc", "gardening", "green", new ArrayList<>());

        // WHEN
        when(uuidService.getRandomId()).thenReturn("abc");
        when(hobbyRepo.insert(any(Hobby.class))).thenReturn(expected);

        Hobby actual = hobbyService.addHobby(newHobbyNoId);

        // THEN
        assertEquals(expected, actual);
        verify(uuidService).getRandomId();
        verify(hobbyRepo).insert(any(Hobby.class));
    }

    @Test
    void updateHobbyName_WhenPuttingHobby() {
        // GIVEN
        String hobbyId = "existingHobbyId";
        String newHobbyName = "Updated Gardening";

        HobbyWithoutID updatedHobby = new HobbyWithoutID(newHobbyName, null);
        Hobby existingHobby = new Hobby(hobbyId, "Gardening", "green", new ArrayList<>());

        when(hobbyRepo.findById(hobbyId)).thenReturn(Optional.of(existingHobby));
        when(hobbyRepo.save(any(Hobby.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // WHEN
        Hobby result = hobbyService.updateHobby(hobbyId, updatedHobby, null);

        // THEN
        assertEquals(newHobbyName, result.getName());
        assertEquals(existingHobby.getColor(), result.getColor()); // Check that color remains unchanged
        verify(hobbyRepo).findById(hobbyId);
        verify(hobbyRepo).save(existingHobby);
    }

    @Test
    void updateHobbyColor_ShouldUpdateHobbyColorAndReturnUpdatedHobby() {
        // GIVEN
        String hobbyId = "existingHobbyId";
        String newColor = "blue";
        Hobby existingHobby = new Hobby(hobbyId, "Gardening", "green", new ArrayList<>());

        when(hobbyRepo.findById(hobbyId)).thenReturn(Optional.of(existingHobby));
        when(hobbyRepo.save(any(Hobby.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // WHEN
        Hobby result = hobbyService.updateHobbyColor(hobbyId, newColor);

        // THEN
        assertEquals(newColor, result.getColor());
        verify(hobbyRepo).findById(hobbyId);
        verify(hobbyRepo).save(existingHobby);
    }

    @Test
    void expectDeleteMethodToBeCalled_whenDeletingHobby() {
        //GIVEN
        String id = "abc";
        //WHEN
        hobbyService.deleteHobby(id);
        //THEN
        verify(hobbyRepo).deleteById(id);
    }

    @Test
    void getDetails_ExistingHobby_ShouldReturnHobby() {
        // GIVEN
        String hobbyId = "existingHobbyId";
        Hobby existingHobby = new Hobby(hobbyId, "Gardening", "green", null);

        HobbyRepo hobbyRepo = mock(HobbyRepo.class);
        when(hobbyRepo.findById(hobbyId)).thenReturn(Optional.of(existingHobby));

        HobbyService hobbyService = new HobbyService(hobbyRepo, null);

        // WHEN
        Hobby result = hobbyService.getHobbyById(hobbyId);

        // THEN
        assertEquals(existingHobby, result);
    }
    @Test
    void expectNoSuchHobbyException_whenHobbyIdNotFound() {
        // GIVEN
        String nonExistentActivityId = "abc";
        when(hobbyRepo.findById(nonExistentActivityId)).thenReturn(Optional.empty());

        // WHEN & THEN
        assertThrows(NoSuchHobbyException.class, () -> hobbyService.getHobbyById(nonExistentActivityId));
    }


    @Test
    void expectActivitiesToBeAddedToHobby_whenAddingActivityToHobby() {
        // GIVEN
        String hobbyId = "existingHobbyId";
        LocalDate activityDate = LocalDate.parse("2023-07-31");
        String generatedActivityId = "someActivityId";
        ActivityWithoutID newActivity = new ActivityWithoutID("New Activity", activityDate, hobbyId, 5, "green");

        Hobby existingHobby = new Hobby(hobbyId, "Gardening", "green", new ArrayList<>());
        when(hobbyRepo.findById(hobbyId)).thenReturn(Optional.of(existingHobby));
        when(uuidService.getRandomId()).thenReturn(generatedActivityId);
        when(hobbyRepo.save(any(Hobby.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // WHEN
        Activity addedActivity = hobbyService.addActivityToHobby(hobbyId, newActivity, "green");

        // THEN
        verify(hobbyRepo).findById(hobbyId);
        verify(hobbyRepo).save(existingHobby);

        // ALSO
        assertEquals(new Activity(generatedActivityId, "New Activity", activityDate, hobbyId, 5, "green"), addedActivity);
    }

    @Test
    void expectNoSuchActivityException_whenActivityIdNotFound() {
        // GIVEN
        String hobbyId = "existingHobbyId";
        String nonExistentActivityId = "abc";
        LocalDate activityDate = LocalDate.parse("2023-07-31");
        ActivityWithoutID newActivity = new ActivityWithoutID("New Activity", activityDate, hobbyId, 5, "green");

        Hobby existingHobby = new Hobby(hobbyId, "Gardening", "green", new ArrayList<>());
        when(hobbyRepo.findById(hobbyId)).thenReturn(Optional.of(existingHobby));
        when(hobbyRepo.save(any(Hobby.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // WHEN & THEN
        NoSuchActivityException exception = assertThrows(NoSuchActivityException.class, () -> hobbyService.updateActivity(hobbyId, nonExistentActivityId, newActivity));
        assertEquals("Activity not found for ID: " + nonExistentActivityId, exception.getMessage());
    }

    @Test
    void expectDeleteActivityFromHobby_whenDeletingActivity() {
        // GIVEN
        String hobbyId = "existingHobbyId";
        String activityId = "existingActivityId";
        Activity existingActivity = new Activity(activityId, "Existing Activity", LocalDate.parse("2023-07-31"), hobbyId, 5, "green");

        Hobby existingHobby = new Hobby(hobbyId, "Gardening", "green", new ArrayList<>(List.of(existingActivity)));
        when(hobbyRepo.findById(hobbyId)).thenReturn(Optional.of(existingHobby));
        when(hobbyRepo.save(any(Hobby.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // WHEN
        hobbyService.deleteActivity(hobbyId, activityId);

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
        assertThrows(NoSuchHobbyException.class, () -> hobbyService.deleteActivity(nonExistentHobbyId, existingActivityId));
    }

    @Test
    void expectNoSuchActivityException_whenActivityIdNotFoundInDeleteActivity() {
        // GIVEN
        String hobbyId = "existingHobbyId";
        String nonExistentActivityId = "abc";
        Activity existingActivity = new Activity("existingActivityId", "Existing Activity", LocalDate.parse("2023-07-31"), hobbyId, 5, "green");

        Hobby existingHobby = new Hobby(hobbyId, "Gardening", "green", new ArrayList<>(List.of(existingActivity)));
        when(hobbyRepo.findById(hobbyId)).thenReturn(Optional.of(existingHobby));
        when(hobbyRepo.save(any(Hobby.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // WHEN & THEN
        assertThrows(NoSuchActivityException.class, () -> hobbyService.deleteActivity(hobbyId, nonExistentActivityId));
    }

    @Test
    void getActivitiesByMonth_ShouldReturnActivitiesWithColor() {
        // GIVEN
        String hobbyId = "existingHobbyId";
        LocalDate activityDate = LocalDate.of(2023, 7, 31);
        Activity activity = new Activity("activityId", "Planting Flowers", activityDate, hobbyId, 4, "green");

        List<Activity> activities = List.of(activity);

        when(hobbyRepo.findAll()).thenReturn(Collections.singletonList(new Hobby(hobbyId, "Gardening", "green", activities)));

        // WHEN
        List<Activity> actualActivities = hobbyService.getActivitiesByMonth(LocalDate.of(2023, 7, 1));

        // THEN
        assertEquals(1, actualActivities.size());
        assertEquals("green", actualActivities.get(0).getColor());
    }
}
