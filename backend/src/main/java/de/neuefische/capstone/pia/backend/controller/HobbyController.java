package de.neuefische.capstone.pia.backend.controller;

import de.neuefische.capstone.pia.backend.model.Activity;
import de.neuefische.capstone.pia.backend.model.ActivityWithoutID;
import de.neuefische.capstone.pia.backend.model.Hobby;
import de.neuefische.capstone.pia.backend.model.HobbyWithoutID;
import de.neuefische.capstone.pia.backend.service.HobbyService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PostMapping
    public Hobby addHobby(@RequestBody HobbyWithoutID newHobby) {
        return hobbyService.addHobby(newHobby);
    }

    @PutMapping("/{id}")
    public Hobby updateHobby(@PathVariable String id, @RequestBody HobbyWithoutID updatedHobby) {
        return hobbyService.updateHobby(id, updatedHobby);
    }

    @DeleteMapping("/{id}")
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
        hobbyService.addActivityToHobby(hobbyId, activityWithoutID);
    }

    @PutMapping("/{hobbyId}/activities/{activityId}")
    public Activity updateActivity(@PathVariable String hobbyId, @PathVariable String activityId, @RequestBody ActivityWithoutID updatedActivity) {
        return hobbyService.updateActivity(hobbyId, activityId, updatedActivity);
    }
}
