package de.neuefische.capstone.pia.backend.controller;

import de.neuefische.capstone.pia.backend.model.Activity;
import de.neuefische.capstone.pia.backend.model.ActivityWithoutID;
import de.neuefische.capstone.pia.backend.model.Hobby;
import de.neuefische.capstone.pia.backend.model.HobbyAddModel;
import de.neuefische.capstone.pia.backend.service.ActivityService;
import de.neuefische.capstone.pia.backend.service.HobbyService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hobbies")
public class HobbyController {
    private final HobbyService hobbyService;
    private final ActivityService activityService;

    public HobbyController(HobbyService hobbyService, ActivityService activityService) {
        this.hobbyService = hobbyService;
        this.activityService = activityService;
    }
    @GetMapping
    public List<Hobby> getHobbies() {
        return hobbyService.getHobbies();
    }

    @PostMapping
    public Hobby addHobby(@RequestBody HobbyAddModel newHobby) {
        return hobbyService.addHobby(newHobby);
    }

    @PutMapping("/{hobbyId}")
    public Hobby updateHobby(@PathVariable String hobbyId, @RequestBody HobbyAddModel updatedHobby) {
        return hobbyService.updateHobby(hobbyId, updatedHobby);
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

    @GetMapping("/hobby/{hobbyId}")
    public Hobby getHobbyById(@PathVariable String hobbyId) {
        return hobbyService.getHobbyById(hobbyId);
    }

    @GetMapping("/hobby/{hobbyId}/activities")
    public List<Activity> getHobbyByIdListActivities(@PathVariable String hobbyId) {
        return activityService.getActivitiesForHobby(hobbyId);
    }

    @PostMapping("/hobby/{hobbyId}/activities")
    public void addActivityToHobby(@PathVariable String hobbyId, @RequestBody ActivityWithoutID activityWithoutID) {
        activityService.addActivityToHobby(hobbyId, activityWithoutID, activityWithoutID.getColor());
    }

    @PutMapping("/hobby/{hobbyId}/activities/{activityId}")
    public Activity updateActivity(@PathVariable String hobbyId, @PathVariable String activityId, @RequestBody ActivityWithoutID updatedActivity) {
        return activityService.updateActivity(hobbyId, activityId, updatedActivity);
    }

    @DeleteMapping("/hobby/{hobbyId}/activities/{activityId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteActivity(@PathVariable String hobbyId, @PathVariable String activityId) {
        activityService.deleteActivity(hobbyId, activityId);
    }
}
