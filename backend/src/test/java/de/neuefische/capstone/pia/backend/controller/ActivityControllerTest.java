package de.neuefische.capstone.pia.backend.controller;

import de.neuefische.capstone.pia.backend.model.Activity;
import de.neuefische.capstone.pia.backend.model.ActivityWithoutID;
import de.neuefische.capstone.pia.backend.model.Hobby;
import de.neuefische.capstone.pia.backend.model.HobbyAddModel;
import de.neuefische.capstone.pia.backend.repo.HobbyRepo;
import de.neuefische.capstone.pia.backend.security.MongoUser;
import de.neuefische.capstone.pia.backend.security.MongoUserRepository;
import de.neuefische.capstone.pia.backend.service.ActivityService;
import de.neuefische.capstone.pia.backend.service.HobbyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
class ActivityControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private HobbyRepo hobbyRepo;

    @Autowired
    private HobbyService hobbyService;

    @Autowired
    private ActivityService activityService;

    @Autowired
    private MongoUserRepository mongoUserRepository;

    private Hobby hobby;
    @BeforeEach
    public void setupHobby() {
        hobby = new Hobby("123", "Gardening", "green", new ArrayList<>(), "1");
        hobbyRepo.save(hobby);
    }
    @BeforeEach
    void setUpUsers() {
        MongoUser user = new MongoUser("1", "username", "Password123");
        mongoUserRepository.save(user);
    }

    @Test
    @DirtiesContext
    @WithMockUser(username = "username", password = "Password123")
    void expectActivities_whenGetActivities() throws Exception{
        //GIVEN
        Activity activity1 = new Activity("1", "Activity A", LocalDate.parse("2023-08-07"), "h1", 1, "green");
        Activity activity2 = new Activity("2", "Activity B", LocalDate.parse("2023-07-09"), "h1", 5, "green");
        Activity activity3 = new Activity("3", "Activity C", LocalDate.parse("2023-08-14"), "h2", 3, "blue");
        hobby.setActivities(List.of(activity1, activity2));
        hobbyRepo.save(hobby);
        Hobby newHobby = new Hobby("h2", "Hobby 2", "blue", List.of(activity3), "1");
        hobbyRepo.save(newHobby);


        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/activities").with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(jsonPath("$[0].activityId").isNotEmpty())
                .andExpect(jsonPath("$[0].name").value("Activity A"))
                .andExpect(jsonPath("$[0].activityDate").value("2023-08-07"))
                .andExpect(jsonPath("$[0].rating").value(1))
                .andExpect(jsonPath("$[0].color").value("green"))
                .andExpect(jsonPath("$[1].activityId").isNotEmpty())
                .andExpect(jsonPath("$[1].name").value("Activity B"))
                .andExpect(jsonPath("$[1].activityDate").value("2023-07-09"))
                .andExpect(jsonPath("$[1].rating").value(5))
                .andExpect(jsonPath("$[1].color").value("green"))
                .andExpect(jsonPath("$[2].activityId").isNotEmpty())
                .andExpect(jsonPath("$[2].name").value("Activity C"))
                .andExpect(jsonPath("$[2].activityDate").value("2023-08-14"))
                .andExpect(jsonPath("$[2].rating").value(3))
                .andExpect(jsonPath("$[2].color").value("blue"));
    }


    @Test
    @DirtiesContext
    @WithMockUser(username = "username", password = "Password123")
    void expectActivityAddedToHobby_whenAddActivityToHobby() throws Exception {
        // GIVEN
        String hobbyId = hobby.getHobbyId();

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.post("/api/hobbies/hobby/{hobbyId}/activities", hobbyId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                            "name": "Planting Flowers",
                            "activityDate": "2023-07-31",
                            "rating": 5,
                            "color": "green"
                        }
                        """)
                        .with(csrf()))

                // THEN
                .andExpect(MockMvcResultMatchers.status().isOk());

        // ALSO
        mockMvc.perform(MockMvcRequestBuilders.get("/api/hobbies/hobby/{hobbyId}/activities", hobbyId).with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$").isArray())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].name").value("Planting Flowers"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].activityDate").value("2023-07-31"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].color").value("green"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].hobbyId").value(hobbyId));
    }

    @Test
    @DirtiesContext
    @WithMockUser(username = "username", password = "Password123")
    void expectUpdatedActivity_whenPuttingActivity() throws Exception {
        // GIVEN
        String hobbyId = hobby.getHobbyId();

        ActivityWithoutID newActivity = new ActivityWithoutID("Planting Flowers", LocalDate.parse("2023-07-31"), hobbyId, 4, "green");
        Activity addedActivity = activityService.addActivityToHobby(hobbyId, newActivity, "green");
        String activityId = addedActivity.getActivityId();

        String actual = """
    {
        "name": "Watering Flowers",
        "activityDate": "2023-08-02",
        "rating": 5,
        "color": "green"
    }
    """;

        String expectedResponse = """
    {
        "activityId": "%s",
        "name": "Watering Flowers",
        "activityDate": "2023-08-02",
        "hobbyId": "%s",
        "rating": 5,
        "color": "green"
    }
    """.formatted(activityId, hobbyId);

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.put("/api/hobbies/hobby/{hobbyId}/activities/{activityId}", hobbyId, activityId)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(actual))

                // THEN
                .andExpect(MockMvcResultMatchers.content().json(expectedResponse))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    @DirtiesContext
    @WithMockUser(username = "username", password = "Password123")
    void expectUpdatedActivityNotFound_whenPuttingActivityWithInvalidIds() throws Exception {
        // GIVEN
        String hobbyId = "invalidHobbyId";
        String activityId = "invalidActivityId";

        String actual = """
    {
        "name": "Watering Flowers",
        "activityDate": "2023-08-02",
        "rating": 5,
        "color": "green"
    }
    """;

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.put("/api/hobbies/hobby/{hobbyId}/activities/{activityId}", hobbyId, activityId)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(actual))

                // THEN
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }


    @Test
    @DirtiesContext
    @WithMockUser(username = "username", password = "Password123")
    void expectActivityDeleted_whenDeletingActivity() throws Exception {
        // GIVEN
        String hobbyId = hobby.getHobbyId();
        LocalDate activityDate = LocalDate.parse("2023-07-31");

        ActivityWithoutID newActivity = new ActivityWithoutID("Planting Flowers", activityDate, hobbyId, 4, "green");
        Activity addedActivity = activityService.addActivityToHobby(hobbyId, newActivity, "green");
        String activityId = addedActivity.getActivityId();

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/hobbies/hobby/{hobbyId}/activities/{activityId}", hobbyId, activityId).with(csrf()))
                // THEN
                .andExpect(MockMvcResultMatchers.status().isNoContent());

        mockMvc.perform(MockMvcRequestBuilders.get("/api/hobbies/hobby/{hobbyId}/activities", hobbyId).with(csrf()))
                // THEN
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    @DirtiesContext
    @WithMockUser(username = "username", password = "Password123")
    void expectActivityCounts_whenGettingActivityCounts() throws Exception {
        // GIVEN
        HobbyAddModel newHobby = new HobbyAddModel("Gardening", "green");
        Hobby addedHobby = hobbyService.addHobby(newHobby);
        String hobbyId = addedHobby.getHobbyId();
        ActivityWithoutID activity1 = new ActivityWithoutID("Activity1", LocalDate.now(), hobbyId, 5, "green");
        ActivityWithoutID activity2 = new ActivityWithoutID("Activity2", LocalDate.now(), hobbyId, 2, "green");
        ActivityWithoutID activity3 = new ActivityWithoutID("Activity1", LocalDate.now(), hobbyId, 5, "green");
        ActivityWithoutID activity4 = new ActivityWithoutID("Activity1", LocalDate.now(), hobbyId, 5, "green");


        activityService.addActivityToHobby(hobbyId, activity1, "green");
        activityService.addActivityToHobby(hobbyId, activity2, "green");
        activityService.addActivityToHobby(hobbyId, activity3, "green");
        activityService.addActivityToHobby(hobbyId, activity4, "green");


        // WHEN & THEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/activities/activity-counts"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.Activity1").value(3))
                .andExpect(jsonPath("$.Activity2").value(1));
    }

    @Test
    @DirtiesContext
    @WithMockUser(username = "username", password = "Password123")
    void expectMostAddedActivity_whenGettingMostAddedActivity() throws Exception {
        // GIVEN
        HobbyAddModel newHobby = new HobbyAddModel("Gardening", "green");
        Hobby addedHobby = hobbyService.addHobby(newHobby);
        String hobbyId = addedHobby.getHobbyId();
        ActivityWithoutID activity1 = new ActivityWithoutID("Activity1", LocalDate.now(), hobbyId, 5, "green");
        ActivityWithoutID activity2 = new ActivityWithoutID("Activity2", LocalDate.now(), hobbyId, 3, "green");
        ActivityWithoutID activity3 = new ActivityWithoutID("Activity1", LocalDate.now(), hobbyId, 5, "green");
        ActivityWithoutID activity4 = new ActivityWithoutID("Activity1", LocalDate.now(), hobbyId, 5, "green");

        activityService.addActivityToHobby(hobbyId, activity1, "green");
        activityService.addActivityToHobby(hobbyId, activity2, "green");
        activityService.addActivityToHobby(hobbyId, activity3, "green");
        activityService.addActivityToHobby(hobbyId, activity4, "green");

        String expectedActivityName = "Activity1";

        // WHEN & THEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/activities/most-added-activity"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(content().contentType("text/plain;charset=UTF-8"))
                .andExpect(content().string(expectedActivityName));
    }

    @Test
    @DirtiesContext
    @WithMockUser(username = "username", password = "Password123")
    void expectNoMostAddedActivity_whenGettingMostAddedActivity() throws Exception {
        // WHEN & THEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/activities/most-added-activity"))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    @DirtiesContext
    @WithMockUser(username = "username", password = "Password123")
    void expectActivityDays_whenGettingActivityDays() throws Exception {
        // GIVEN
        HobbyAddModel newHobby = new HobbyAddModel("Gardening", "green");
        Hobby addedHobby = hobbyService.addHobby(newHobby);
        String hobbyId = addedHobby.getHobbyId();
        ActivityWithoutID activity1 = new ActivityWithoutID("Activity1",  LocalDate.parse("2023-08-07"), hobbyId, 5, "green");
        ActivityWithoutID activity2 = new ActivityWithoutID("Activity2",  LocalDate.parse("2023-08-14"), hobbyId, 3, "green");
        ActivityWithoutID activity3 = new ActivityWithoutID("Activity1", LocalDate.parse("2023-08-21"), hobbyId, 5, "green");
        ActivityWithoutID activity4 = new ActivityWithoutID("Activity1", LocalDate.parse("2023-07-09"), hobbyId, 5, "green");


        activityService.addActivityToHobby(hobbyId, activity1, "green");
        activityService.addActivityToHobby(hobbyId, activity2, "green");
        activityService.addActivityToHobby(hobbyId, activity3, "green");
        activityService.addActivityToHobby(hobbyId, activity4, "green");

        // WHEN & THEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/activities/activity-days"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.MONDAY").value(3))
                .andExpect(jsonPath("$.SUNDAY").value(1));
    }
}
