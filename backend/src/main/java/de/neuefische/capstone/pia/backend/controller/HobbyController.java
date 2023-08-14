package de.neuefische.capstone.pia.backend.controller;

import de.neuefische.capstone.pia.backend.model.Activity;
import de.neuefische.capstone.pia.backend.model.ActivityWithoutID;
import de.neuefische.capstone.pia.backend.model.Hobby;
import de.neuefische.capstone.pia.backend.model.HobbyAddModel;
import de.neuefische.capstone.pia.backend.service.ActivityService;
import de.neuefische.capstone.pia.backend.service.CalendarService;
import de.neuefische.capstone.pia.backend.service.HobbyService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hobbies")
public class HobbyController {
    private final HobbyService hobbyService;
    private final ActivityService activityService;
    private final CalendarService calendarService;

    public HobbyController(HobbyService hobbyService, ActivityService activityService, CalendarService calendarService) {
        this.hobbyService = hobbyService;
        this.activityService = activityService;
        this.calendarService = calendarService;
    }

    @GetMapping
    public List<Hobby> getHobbies() {
        return hobbyService.getHobbies();
    }

    @GetMapping("/calendar")
    public List<Activity> getActivitiesByMonth(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate month) {
        return calendarService.getActivitiesByMonth(month);
    }

    @PostMapping
    public Hobby addHobby(@RequestBody HobbyAddModel newHobby) {
        return hobbyService.addHobby(newHobby);
    }

    @PutMapping("/{hobbyId}")
    public Hobby updateHobby(@PathVariable String hobbyId, @RequestBody HobbyAddModel updatedHobby, @RequestParam(required = false) String color) {
        return hobbyService.updateHobby(hobbyId, updatedHobby, color);
    }

    @PutMapping("/{hobbyId}/color")
    public Hobby updateHobbyColor(@PathVariable String hobbyId, @RequestParam String color) {
        return hobbyService.updateHobbyColor(hobbyId, color);
    }

    @DeleteMapping("/{hobbyId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteHobby(@PathVariable String hobbyId) {
        hobbyService.deleteHobby(hobbyId);
    }

    @GetMapping("/{hobbyId}/activities")
    public List<Activity> getHobbyById(@PathVariable String hobbyId) {
        return activityService.getActivitiesByHobbyId(hobbyId);
    }

    @PostMapping("/{hobbyId}/activities")
    public void addActivityToHobby(@PathVariable String hobbyId, @RequestBody ActivityWithoutID activityWithoutID) {
        activityService.addActivityToHobby(hobbyId, activityWithoutID, activityWithoutID.getColor());
    }

    @PutMapping("/{hobbyId}/activities/{activityId}")
    public Activity updateActivity(@PathVariable String hobbyId, @PathVariable String activityId, @RequestBody ActivityWithoutID updatedActivity) {
        return activityService.updateActivity(hobbyId, activityId, updatedActivity);
    }

    @DeleteMapping("/{hobbyId}/activities/{activityId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteActivity(@PathVariable String hobbyId, @PathVariable String activityId) {
        activityService.deleteActivity(hobbyId, activityId);
    }

    @GetMapping("/statistics/activity-counts")
    public Map<String, Long> getActivityCounts() {
        return activityService.getActivityCounts();
    }

    @GetMapping("/statistics/most-added-activity")
    public ResponseEntity<String> getMostAddedActivity() {
        String mostAddedActivityName = activityService.getMostAddedActivityName();

        if (mostAddedActivityName != null) {
            return ResponseEntity.ok(mostAddedActivityName);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/statistics/activity-days")
    public Map<String, Long> getActivityDays() {
        return activityService.getActivityDays();
    }

}
