package de.neuefische.capstone.pia.backend.service;

import de.neuefische.capstone.pia.backend.exceptions.NoSuchActivityException;
import de.neuefische.capstone.pia.backend.exceptions.NoSuchHobbyException;
import de.neuefische.capstone.pia.backend.model.Activity;
import de.neuefische.capstone.pia.backend.model.ActivityWithoutID;
import de.neuefische.capstone.pia.backend.model.Hobby;
import de.neuefische.capstone.pia.backend.model.UUIDService;
import de.neuefische.capstone.pia.backend.repo.HobbyRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ActivityService {

    private final HobbyRepo hobbyRepo;
    private final UUIDService uuidService;

    private final HobbyService hobbyService;

    public ActivityService(HobbyRepo hobbyRepo, UUIDService uuidService, HobbyService hobbyService) {
        this.hobbyRepo = hobbyRepo;
        this.uuidService = uuidService;
        this.hobbyService = hobbyService;
    }

    public List<Activity> getActivitiesByHobbyId(String hobbyId) {
        Hobby hobby = hobbyService.getHobbyById(hobbyId);
        List<Activity> activities = hobby.getActivities();

        String hobbyColor = hobby.getColor();
        activities.forEach(activity -> activity.setColor(hobbyColor));

        return activities;
    }

    public List<Activity> getAllActivities() {
        List<Hobby> userHobbies = hobbyService.getHobbies();
        return userHobbies.stream()
                .flatMap(hobby -> hobby.getActivities().stream())
                .toList();
    }

    public Activity getActivityByHobbyId(String hobbyId, String activityId) {
        Optional<Hobby> hobbyOptional = hobbyRepo.findById(hobbyId);
        Hobby hobby = hobbyOptional.orElseThrow(() -> new NoSuchHobbyException(hobbyId));

        Optional<Activity> activityOptional = hobby.getActivities().stream()
                .filter(activity -> activity.getActivityId().equals(activityId))
                .findFirst();

        return activityOptional.orElseThrow(() -> new NoSuchActivityException(activityId));
    }

    public Activity addActivityToHobby(String hobbyId, ActivityWithoutID activityWithoutID, String color) {
        Hobby hobby = hobbyService.getHobbyById(hobbyId);
        String activityId = uuidService.getRandomId();

        activityWithoutID.setHobbyId(hobbyId);
        activityWithoutID.setColor(color);

        Activity newActivity = new Activity(activityId, activityWithoutID.getName(), activityWithoutID.getActivityDate(), hobbyId, activityWithoutID.getRating(), color);
        hobby.addActivity(newActivity);
        hobbyRepo.save(hobby);
        return newActivity;
    }


    public Activity updateActivity(String hobbyId, String activityId, ActivityWithoutID updatedActivity) {
        Hobby hobby = hobbyService.getHobbyById(hobbyId);
        String activityColor = hobby.getColor();

        hobby.updateActivity(activityId, updatedActivity);

        Activity updatedActivityInHobby = hobby.getActivities().stream()
                .filter(activity -> activity.getActivityId().equals(activityId))
                .findFirst()
                .orElseThrow(() -> new NoSuchActivityException(activityId));

        updatedActivityInHobby.setHobbyId(hobbyId);
        updatedActivityInHobby.setColor(activityColor);

        hobbyRepo.save(hobby);

        return updatedActivityInHobby;
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

    public Map<String, Long> getActivityCounts() {
        List<Hobby> userHobbies = hobbyService.getHobbies();
        List<Activity> allActivities = userHobbies.stream()
                .flatMap(hobby -> hobby.getActivities().stream())
                .toList();

        return allActivities.stream()
                .collect(Collectors.groupingBy(Activity::getName, Collectors.counting()));
    }

    public String getMostAddedActivityName() {
        List<Hobby> userHobbies = hobbyService.getHobbies();
        List<Activity> allActivities = userHobbies.stream()
                .flatMap(hobby -> hobby.getActivities().stream())
                .toList();

        Map<String, Long> activityCounts = allActivities.stream()
                .collect(Collectors.groupingBy(Activity::getName, Collectors.counting()));

        return activityCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);
    }

    public Map<String, Long> getActivityDays() {
        List<Hobby> userHobbies = hobbyService.getHobbies();
        List<Activity> allActivities = userHobbies.stream()
                .flatMap(hobby -> hobby.getActivities().stream())
                .toList();

        return allActivities.stream()
                .collect(Collectors.groupingBy(activity ->
                        activity.getActivityDate().getDayOfWeek().name(), Collectors.counting()));
    }

}

