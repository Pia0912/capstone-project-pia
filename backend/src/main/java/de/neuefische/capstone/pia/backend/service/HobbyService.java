package de.neuefische.capstone.pia.backend.service;

import de.neuefische.capstone.pia.backend.exceptions.NoSuchActivityException;
import de.neuefische.capstone.pia.backend.exceptions.NoSuchHobbyException;
import de.neuefische.capstone.pia.backend.model.*;
import de.neuefische.capstone.pia.backend.repo.HobbyRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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
        Hobby hobby = new Hobby(id, newHobby.getName(), newHobby.getColor(), new ArrayList<>());
        return hobbyRepo.insert(hobby);
    }

    public Hobby updateHobby(String id, HobbyWithoutID hobbyNoID, String newColor) {
        Hobby hobby = hobbyRepo.findById(id)
                .orElseThrow(() -> new NoSuchHobbyException(id));
        hobby.setName(hobbyNoID.getName());
        if (newColor != null) {
            hobby.setColor(newColor);
        }
        return hobbyRepo.save(hobby);
    }

    public void deleteHobby(String id) {
        hobbyRepo.deleteById(id);
    }

    public Hobby getHobbyById(String id) {
        return hobbyRepo.findById(id).orElseThrow(() -> new NoSuchHobbyException(id));
    }

    public Activity addActivityToHobby(String hobbyId, ActivityWithoutID activityWithoutID, String color) {
        Hobby hobby = getHobbyById(hobbyId);
        String activityId = uuidService.getRandomId();

        activityWithoutID.setHobbyId(hobbyId);
        activityWithoutID.setColor(color);

        Activity newActivity = new Activity(activityId, activityWithoutID.getName(), activityWithoutID.getActivityDate(), hobbyId, activityWithoutID.getRating(), color);
        hobby.addActivity(newActivity);
        hobbyRepo.save(hobby);
        return newActivity;
    }


    public Activity updateActivity(String hobbyId, String activityId, ActivityWithoutID updatedActivity) {
        Hobby hobby = hobbyRepo.findById(hobbyId).orElseThrow(() -> new NoSuchHobbyException(hobbyId));
        Activity activityToUpdate = hobby.getActivities().stream()
                .filter(activity -> activity.getActivityId().equals(activityId))
                .findFirst()
                .orElseThrow(() -> new NoSuchActivityException(activityId));

        activityToUpdate.setName(updatedActivity.getName());
        activityToUpdate.setActivityDate(updatedActivity.getActivityDate());
        activityToUpdate.setRating(updatedActivity.getRating());

        String activityColor = hobby.getColor();
        activityToUpdate.setColor(activityColor);

        hobbyRepo.save(hobby);

        return activityToUpdate;
    }

    public void deleteActivity(String hobbyId, String activityId) {
        Hobby hobby = hobbyRepo.findById(hobbyId)
                .orElseThrow(() -> new NoSuchHobbyException(hobbyId));

        Activity activityToDelete = hobby.getActivities().stream()
                .filter(activity -> activity.getActivityId().equals(activityId))
                .findFirst()
                .orElseThrow(() -> new NoSuchActivityException(activityId));

        hobby.removeActivity(activityToDelete);

        hobbyRepo.save(hobby);
    }
    public Hobby updateHobbyColor(String id, String color) {
        Hobby hobby = hobbyRepo.findById(id)
                .orElseThrow(() -> new NoSuchHobbyException(id));
        hobby.setColor(color);
        return hobbyRepo.save(hobby);
    }

    public List<Activity> getActivitiesByMonth(LocalDate month) {
        List<Activity> activitiesWithColor = new ArrayList<>();
        List<Hobby> hobbies = getHobbies();

        for (Hobby hobby : hobbies) {
            for (Activity activity : hobby.getActivities()) {
                LocalDate activityDate = activity.getActivityDate();
                if (activityDate.getMonth() == month.getMonth() && activityDate.getYear() == month.getYear()) {
                    Activity activityWithColor = new Activity();
                    activityWithColor.setActivityId(activity.getActivityId());
                    activityWithColor.setActivityDate(activityDate);
                    activityWithColor.setColor(hobby.getColor());
                    activityWithColor.setHobbyId(hobby.getId());
                    activityWithColor.setRating(activity.getRating());
                    activitiesWithColor.add(activityWithColor);
                }
            }
        }


        return activitiesWithColor;
    }
}

