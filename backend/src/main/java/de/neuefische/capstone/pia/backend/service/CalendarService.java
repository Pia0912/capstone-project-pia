package de.neuefische.capstone.pia.backend.service;

import de.neuefische.capstone.pia.backend.model.Activity;
import de.neuefische.capstone.pia.backend.model.Hobby;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class CalendarService {

    private final HobbyService hobbyService;

    public CalendarService(HobbyService hobbyService) {
        this.hobbyService = hobbyService;
    }

    public List<Activity> getActivitiesByMonth(LocalDate month) {
        List<Activity> activitiesWithColor = new ArrayList<>();
        List<Hobby> hobbies = hobbyService.getHobbies();
        try {
            for (Hobby hobby : hobbies) {
                for (Activity activity : hobby.getActivities()) {
                    LocalDate activityDate = activity.getActivityDate();
                    if (activityDate.getMonth() == month.getMonth() && activityDate.getYear() == month.getYear()) {
                        Activity activityWithColor = new Activity();
                        activityWithColor.setActivityId(activity.getActivityId());
                        activityWithColor.setActivityDate(activityDate);
                        activityWithColor.setColor(hobby.getColor());
                        activityWithColor.setHobbyId(hobby.getHobbyId());
                        activityWithColor.setRating(activity.getRating());
                        activityWithColor.setName(activity.getName());
                        activitiesWithColor.add(activityWithColor);
                    }
                }
            }
        } catch (NullPointerException e) {
            e.printStackTrace();
        }

        return activitiesWithColor;
    }
}
