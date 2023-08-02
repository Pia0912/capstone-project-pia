package de.neuefische.capstone.pia.backend.service;

import de.neuefische.capstone.pia.backend.exceptions.NoSuchActivityException;
import de.neuefische.capstone.pia.backend.exceptions.NoSuchHobbyException;
import de.neuefische.capstone.pia.backend.model.*;
import de.neuefische.capstone.pia.backend.repo.HobbyRepo;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class HobbyService {
    private final HobbyRepo hobbyRepo;
    private final UUIDService uuidService;

    public HobbyService(HobbyRepo hobbyRepo, UUIDService uuidService) {
        this.hobbyRepo = hobbyRepo;
        this.uuidService = uuidService;
    }

    public List<Hobby> getHobbies() {
        return hobbyRepo.findAll();
    }

    public Hobby addHobby(HobbyWithoutID newHobby) {
        String id = uuidService.getRandomId();
        Hobby hobby = new Hobby(id, newHobby.getName(), new ArrayList<>());
        return hobbyRepo.insert(hobby);
    }

    public Hobby updateHobby(String id, HobbyWithoutID hobbyNoID) {
        Hobby hobby = hobbyRepo.findById(id)
                .orElseThrow(() -> new NoSuchHobbyException(id));
        hobby.setName(hobbyNoID.getName());
        return hobbyRepo.save(hobby);
    }

    public void deleteHobby(String id) {
        hobbyRepo.deleteById(id);
    }

    public Hobby getHobbyById(String id) {
        return hobbyRepo.findById(id).orElseThrow(() -> new NoSuchHobbyException(id));
    }

    public void addActivityToHobby(String hobbyId, ActivityWithoutID activityWithoutID) {
        Hobby hobby = getHobbyById(hobbyId);
        String activityId = uuidService.getRandomId();
        activityWithoutID.setHobbyId(hobbyId);
        Activity newActivity = new Activity(activityId, activityWithoutID.getName(), activityWithoutID.getDate(), hobbyId, activityWithoutID.getRating());
        hobby.addActivity(newActivity);
        hobbyRepo.save(hobby);
    }

    public Activity updateActivity(String hobbyId, String activityId, ActivityWithoutID activityNoID) {
        Hobby hobby = hobbyRepo.findById(hobbyId)
                .orElseThrow(() -> new NoSuchHobbyException(hobbyId));
        Map<String, Activity> activityMap = new HashMap<>();
        for (Activity existingActivity : hobby.getActivities()) {
            activityMap.put(existingActivity.getActivityId(), existingActivity);
        }

        if (activityMap.containsKey(activityId)) {
            Activity editedActivity = activityMap.get(activityId);
            editedActivity.setName(activityNoID.getName());
            editedActivity.setDate(activityNoID.getDate());
            editedActivity.setRating(activityNoID.getRating());
            return hobbyRepo.save(hobby).getActivities().stream()
                    .filter(activity -> activity.getActivityId().equals(activityId))
                    .findFirst()
                    .orElseThrow(() -> new NoSuchActivityException(activityId));
        } else {
            throw new NoSuchActivityException(activityId);
        }
    }
}
