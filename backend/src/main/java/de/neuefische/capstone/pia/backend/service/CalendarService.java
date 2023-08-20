package de.neuefische.capstone.pia.backend.service;

import de.neuefische.capstone.pia.backend.model.Activity;
import de.neuefische.capstone.pia.backend.model.Hobby;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class CalendarService {

    private final HobbyService hobbyService;

    public CalendarService(HobbyService hobbyService) {
        this.hobbyService = hobbyService;
    }

    public List<Activity> getActivitiesByMonth(LocalDate month) {
        List<Hobby> hobbies = hobbyService.getHobbies();

        return hobbies.stream()
                .flatMap(hobby -> hobby.getActivities().stream()
                        .filter(activity -> isActivityInMonth(activity, month))
                        .map(activity -> createActivityWithColor(activity, hobby.getColor())))
                .toList();
    }

    private boolean isActivityInMonth(Activity activity, LocalDate month) {
        LocalDate activityDate = activity.getActivityDate();
        return activityDate.getMonth() == month.getMonth() && activityDate.getYear() == month.getYear();
    }

    private Activity createActivityWithColor(Activity activity, String color) {
        Activity activityWithColor = new Activity();
        activityWithColor.setActivityId(activity.getActivityId());
        activityWithColor.setActivityDate(activity.getActivityDate());
        activityWithColor.setColor(color);
        activityWithColor.setHobbyId(activity.getHobbyId());
        activityWithColor.setRating(activity.getRating());
        activityWithColor.setName(activity.getName());
        return activityWithColor;
    }
}
