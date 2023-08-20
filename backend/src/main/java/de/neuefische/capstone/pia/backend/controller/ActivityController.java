package de.neuefische.capstone.pia.backend.controller;

import de.neuefische.capstone.pia.backend.model.Activity;
import de.neuefische.capstone.pia.backend.service.ActivityService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }
    @GetMapping
    public List<Activity> getActivities() {
        return activityService.getAllActivities();
    }

    @GetMapping("/activity-counts")
    public Map<String, Long> getActivityCounts() {
        return activityService.getActivityCounts();
    }

    @GetMapping("/most-added-activity")
    public String getMostAddedActivity() {
        return activityService.getMostAddedActivityName();
    }
    @GetMapping("/activity-days")
    public Map<String, Long> getActivityDays() {
        return activityService.getActivityDays();
    }
}
