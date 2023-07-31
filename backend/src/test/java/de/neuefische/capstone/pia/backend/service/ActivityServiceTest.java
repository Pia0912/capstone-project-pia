package de.neuefische.capstone.pia.backend.service;

import de.neuefische.capstone.pia.backend.model.Activity;
import de.neuefische.capstone.pia.backend.repo.ActivityRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class ActivityServiceTest {

    private ActivityRepo activityRepo;
    private ActivityService activityService;

    @BeforeEach
    public void setup() {
        activityRepo = mock(ActivityRepo.class);
        activityService = new ActivityService(activityRepo);
    }

    @Test
    void getActivities_ShouldReturnListOfActivities() {
        // GIVEN
        List<Activity> expected = new ArrayList<>();
        expected.add(new Activity("1", "Reading", LocalDate.now(), "hobbyId"));
        expected.add(new Activity("2", "Cooking", LocalDate.now(), "hobbyId"));

        // WHEN
        when(activityRepo.findAll()).thenReturn(expected);
        List<Activity> actual = activityService.getActivities();

        // THEN
        assertEquals(expected, actual);
        verify(activityRepo).findAll();
    }


}
