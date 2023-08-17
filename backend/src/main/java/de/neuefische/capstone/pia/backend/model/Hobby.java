package de.neuefische.capstone.pia.backend.model;

import de.neuefische.capstone.pia.backend.exceptions.NoSuchActivityException;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Hobby {
    @Id
    private String hobbyId;
    private String name;
    private String color;
    private List<Activity> activities = new ArrayList<>();
    private String authorId;

    public void addActivity(Activity activity) {
        activities.add(activity);
    }

    public void updateActivity(String activityId, ActivityWithoutID updatedActivity) {
        Activity existingActivity = activities.stream()
                .filter(activity -> activity.getActivityId().equals(activityId))
                .findFirst()
                .orElseThrow(() -> new NoSuchActivityException(activityId));

        existingActivity.setName(updatedActivity.getName());
        existingActivity.setActivityDate(updatedActivity.getActivityDate());
        existingActivity.setRating(updatedActivity.getRating());
    }

    public void removeActivity(Activity activity) {
        activities.remove(activity);
    }
}
