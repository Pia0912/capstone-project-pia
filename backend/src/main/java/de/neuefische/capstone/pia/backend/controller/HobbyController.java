package de.neuefische.capstone.pia.backend.controller;

import de.neuefische.capstone.pia.backend.model.Activity;
import de.neuefische.capstone.pia.backend.model.ActivityWithoutID;
import de.neuefische.capstone.pia.backend.model.Hobby;
import de.neuefische.capstone.pia.backend.model.HobbyWithoutID;
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

    public HobbyController(HobbyService hobbyService) {
        this.hobbyService = hobbyService;
    }

    @GetMapping
    public List<Hobby> getHobbies() {
        return hobbyService.getHobbies();
    }

    @GetMapping("/calendar")
    public List<Activity> getActivitiesByMonth(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate month) {
        return hobbyService.getActivitiesByMonth(month);
    }

    @PostMapping
    public Hobby addHobby(@RequestBody HobbyWithoutID newHobby) {
        return hobbyService.addHobby(newHobby);
    }

    @PutMapping("/{id}")
    public Hobby updateHobby(@PathVariable String id, @RequestBody HobbyWithoutID updatedHobby, @RequestParam(required = false) String color) {
        return hobbyService.updateHobby(id, updatedHobby, color);
    }

    @PutMapping("/{id}/color")
    public Hobby updateHobbyColor(@PathVariable String id, @RequestParam String color) {
        return hobbyService.updateHobbyColor(id, color);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteHobby(@PathVariable String id) {
        hobbyService.deleteHobby(id);
    }

    @GetMapping("/{id}")
    public Hobby getHobbyById(@PathVariable String id) {
        return hobbyService.getHobbyById(id);
    }

    @GetMapping("/{hobbyId}/activities")
    public List<Activity> getHobbyByIdListActivities(@PathVariable String hobbyId) {
        return hobbyService.getHobbyById(hobbyId).getActivities();
    }

    @PostMapping("/{hobbyId}/activities")
    public void addActivityToHobby(@PathVariable String hobbyId, @RequestBody ActivityWithoutID activityWithoutID) {
        hobbyService.addActivityToHobby(hobbyId, activityWithoutID, activityWithoutID.getColor());
    }

    @PutMapping("/{hobbyId}/activities/{activityId}")
    public Activity updateActivity(@PathVariable String hobbyId, @PathVariable String activityId, @RequestBody ActivityWithoutID updatedActivity) {
        return hobbyService.updateActivity(hobbyId, activityId, updatedActivity);
    }

    @DeleteMapping("/{hobbyId}/activities/{activityId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteActivity(@PathVariable String hobbyId, @PathVariable String activityId) {
        hobbyService.deleteActivity(hobbyId, activityId);
    }

    @GetMapping("/statistics/activity-counts")
    public Map<String, Long> getActivityCounts() {
        return hobbyService.getActivityCounts();
    }

    @GetMapping("/statistics/most-added-activity")
    public ResponseEntity<String> getMostAddedActivity() {
        String mostAddedActivityName = hobbyService.getMostAddedActivityName();

        if (mostAddedActivityName != null) {
            return ResponseEntity.ok(mostAddedActivityName);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/statistics/activity-days")
    public Map<String, Long> getActivityDays() {
        return hobbyService.getActivityDays();
    }

}
