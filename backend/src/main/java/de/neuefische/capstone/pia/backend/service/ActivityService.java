package de.neuefische.capstone.pia.backend.service;

import de.neuefische.capstone.pia.backend.model.Activity;
import de.neuefische.capstone.pia.backend.repo.ActivityRepo;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class ActivityService {
    private final ActivityRepo activityRepo;

    public ActivityService(ActivityRepo activityRepo) {
        this.activityRepo = activityRepo;
    }

    public List<Activity> getActivities() {
        return activityRepo.findAll();
    }
}
