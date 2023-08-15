package de.neuefische.capstone.pia.backend.controller;

import de.neuefische.capstone.pia.backend.model.Activity;
import de.neuefische.capstone.pia.backend.model.ActivityWithoutID;
import de.neuefische.capstone.pia.backend.model.Hobby;
import de.neuefische.capstone.pia.backend.model.HobbyAddModel;
import de.neuefische.capstone.pia.backend.repo.HobbyRepo;
import de.neuefische.capstone.pia.backend.service.ActivityService;
import de.neuefische.capstone.pia.backend.service.HobbyService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.junit.jupiter.api.BeforeEach;

import java.time.LocalDate;
import java.util.ArrayList;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
class IntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private HobbyRepo hobbyRepo;

    @Autowired
    private HobbyService hobbyService;

    @Autowired
    private ActivityService activityService;


    private Hobby hobby;
    @BeforeEach
    public void setup() {
        hobby = new Hobby("123", "Gardening", "green", new ArrayList<>());
        hobbyRepo.save(hobby);
    }

    @Test
    void expectHobbyList_whenGettingAllHobbies() throws Exception {

        // WHEN & THEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/hobbies"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(jsonPath("$[0].hobbyId").value(hobby.getHobbyId()))
                .andExpect(jsonPath("$[0].name").value("Gardening"))
                .andExpect(jsonPath("$[0].color").value("green"))
                .andExpect(jsonPath("$[0].activities").isArray());
    }



    @Test
    @DirtiesContext
    void expectNewHobby_whenPostingHobby() throws Exception {
        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.post("/api/hobbies")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                            "name": "Home",
                            "color": "blue"
                        }
                        """))
                //THEN
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.hobbyId").isNotEmpty())
                .andExpect(jsonPath("$.name").value("Home"))
                .andExpect(jsonPath("$.color").value("blue"));
    }


    @Test
    @DirtiesContext
    void expectUpdatedHobbyName_whenPuttingHobby() throws Exception {
        // GIVEN
        String hobbyId = hobby.getHobbyId();

        String updatedName = "Garden";
        String updatedHobbyJson = """
{
    "hobbyId": "%s",
    "name": "%s",
    "color": "green"
}
""".formatted(hobbyId, updatedName);

        String expectedJson = """
{
    "hobbyId": "%s",
    "name": "%s",
    "color": "green"
}
""".formatted(hobbyId, updatedName);


        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.put("/api/hobbies/{hobbyId}", hobbyId)
                        .content(updatedHobbyJson)
                        .contentType(MediaType.APPLICATION_JSON))

                // THEN
                .andExpect(MockMvcResultMatchers.content().json(expectedJson))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    @DirtiesContext
    void expectUpdatedHobbyColor_whenPuttingHobbyColor() throws Exception {
        // GIVEN
        String hobbyId = hobby.getHobbyId();

        String updatedColor = "pink";
        String updatedHobbyJson = """
    {
        "hobbyId": "%s",
        "name": "Gardening",
        "color": "%s"
    }
    """.formatted(hobbyId, updatedColor);

        String expectedJson = """
    {
        "hobbyId": "%s",
        "name": "Gardening",
        "color": "%s"
    }
    """.formatted(hobbyId, updatedColor);

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.put("/api/hobbies/{hobbyId}/color", hobbyId)
                        .param("color", updatedColor)
                        .content(updatedHobbyJson)
                        .contentType(MediaType.APPLICATION_JSON))

                // THEN
                .andExpect(MockMvcResultMatchers.content().json(expectedJson))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }



    @Test
    @DirtiesContext
    void expectNoHobby_whenDeletingHobby() throws Exception {
        //GIVEN
        String hobbyId = hobby.getHobbyId();

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/hobbies/" + hobbyId))
                // THEN
                .andExpect(MockMvcResultMatchers.status().isNoContent());

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/hobbies"))
                // THEN
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    @DirtiesContext
    void expectEmptyActivitiesList_whenListActivitiesWithNoActivities() throws Exception {
        // GIVEN
        HobbyAddModel newHobby = new HobbyAddModel("Gardening", "green");
        Hobby addedHobby = this.hobbyService.addHobby(newHobby);
        String hobbyId = addedHobby.getHobbyId();

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/hobbies/hobby/{hobbyId}/activities", hobbyId))

                // THEN
                .andExpect(MockMvcResultMatchers.status().isOk()).andExpect(content().contentType(MediaType.APPLICATION_JSON)).andExpect(MockMvcResultMatchers.jsonPath("$").isEmpty());
    }

    @Test
    @DirtiesContext
    void expectHobbyByIdWithActivities_whenGetHobbyById() throws Exception {
        // GIVEN
        String hobbyId = hobby.getHobbyId();

        mockMvc.perform(MockMvcRequestBuilders.post("/api/hobbies/hobby/{hobbyId}/activities", hobbyId)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                            "name": "Watering Plants",
                            "activityDate": "2023-08-01",
                            "rating": 5,
                            "color": "green"
                        }
                        """));

        mockMvc.perform(MockMvcRequestBuilders.post("/api/hobbies/hobby/{hobbyId}/activities", hobbyId)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                            "name": "Pruning",
                            "activityDate": "2023-08-05",
                            "rating": 2,
                            "color": "green"
                        }
                        """));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/hobbies/hobby/{hobbyId}/activities", hobbyId))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].activityId").isNotEmpty())
                .andExpect(jsonPath("$[0].name").value("Watering Plants"))
                .andExpect(jsonPath("$[0].activityDate").value("2023-08-01"))
                .andExpect(jsonPath("$[0].hobbyId").value(hobbyId))
                .andExpect(jsonPath("$[0].rating").value(5))
                .andExpect(jsonPath("$[0].color").value("green"))
                .andExpect(jsonPath("$[1].activityId").isNotEmpty())
                .andExpect(jsonPath("$[1].name").value("Pruning"))
                .andExpect(jsonPath("$[1].activityDate").value("2023-08-05"))
                .andExpect(jsonPath("$[1].hobbyId").value(hobbyId))
                .andExpect(jsonPath("$[1].rating").value(2))
                .andExpect(jsonPath("$[1].color").value("green"));
    }



    @Test
    @DirtiesContext
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
                        """))

                // THEN
                .andExpect(MockMvcResultMatchers.status().isOk());

        // ALSO
        mockMvc.perform(MockMvcRequestBuilders.get("/api/hobbies/hobby/{hobbyId}/activities", hobbyId))
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
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(actual))

                // THEN
                .andExpect(MockMvcResultMatchers.content().json(expectedResponse))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    @DirtiesContext
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
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(actual))

                // THEN
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }


    @Test
    @DirtiesContext
    void expectActivityDeleted_whenDeletingActivity() throws Exception {
        // GIVEN
        String hobbyId = hobby.getHobbyId();
        LocalDate activityDate = LocalDate.parse("2023-07-31");

        ActivityWithoutID newActivity = new ActivityWithoutID("Planting Flowers", activityDate, hobbyId, 4, "green");
        Activity addedActivity = activityService.addActivityToHobby(hobbyId, newActivity, "green");
        String activityId = addedActivity.getActivityId();

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/hobbies/hobby/{hobbyId}/activities/{activityId}", hobbyId, activityId))
                // THEN
                .andExpect(MockMvcResultMatchers.status().isNoContent());

        mockMvc.perform(MockMvcRequestBuilders.get("/api/hobbies/hobby/{hobbyId}/activities", hobbyId))
                // THEN
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(content().json("[]"));
    }


    @Test
    @DirtiesContext
    void expectActivityColor_whenGetActivityByMonth() throws Exception {
        // GIVEN
        HobbyAddModel newHobby = new HobbyAddModel("Gardening", "green");
        Hobby addedHobby = hobbyService.addHobby(newHobby);
        String hobbyId = addedHobby.getHobbyId();
        LocalDate activityDate = LocalDate.parse("2023-07-31");

        ActivityWithoutID newActivity = new ActivityWithoutID("Planting Flowers", activityDate, hobbyId, 4, "green");
        Activity addedActivity = activityService.addActivityToHobby(hobbyId, newActivity, "green");

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/hobbies/calendar")
                        .param("month", "2023-07-01")
                        .contentType(MediaType.APPLICATION_JSON))
                // THEN
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].color").value(addedActivity.getColor()));
    }

    @Test
    @DirtiesContext
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
        mockMvc.perform(MockMvcRequestBuilders.get("/api/hobbies/statistics/activity-counts"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.Activity1").value(3))
                .andExpect(jsonPath("$.Activity2").value(1));
    }

    @Test
    @DirtiesContext
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
        mockMvc.perform(MockMvcRequestBuilders.get("/api/hobbies/statistics/most-added-activity"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(content().contentType("text/plain;charset=UTF-8"))
                .andExpect(content().string(expectedActivityName));
    }



    @Test
    @DirtiesContext
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
        mockMvc.perform(MockMvcRequestBuilders.get("/api/hobbies/statistics/activity-days"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.MONDAY").value(3))
                .andExpect(jsonPath("$.SUNDAY").value(1));
    }

}
