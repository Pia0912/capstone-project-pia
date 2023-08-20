package de.neuefische.capstone.pia.backend.controller;

import de.neuefische.capstone.pia.backend.model.Activity;
import de.neuefische.capstone.pia.backend.model.ActivityWithoutID;
import de.neuefische.capstone.pia.backend.model.Hobby;
import de.neuefische.capstone.pia.backend.repo.HobbyRepo;
import de.neuefische.capstone.pia.backend.security.MongoUser;
import de.neuefische.capstone.pia.backend.security.MongoUserRepository;
import de.neuefische.capstone.pia.backend.service.ActivityService;
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
import org.junit.jupiter.api.BeforeEach;

import java.time.LocalDate;
import java.util.ArrayList;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
class HobbyControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private HobbyRepo hobbyRepo;

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
    void expectHobbyListForUser_whenGetAllHobbies() throws Exception {

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
    void expectNoHobbyList_whenGettingAllHobbies_noLogin() throws Exception {

        // WHEN & THEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/hobbies"))
                .andExpect(MockMvcResultMatchers.status().isUnauthorized());
    }

    @Test
    @DirtiesContext
    @WithMockUser(username = "username", password = "Password123")
    void expectNewHobby_whenPostingHobby() throws Exception {
        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.post("/api/hobbies")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "name": "Home",
                                    "color": "blue"
                                }
                                """)
                        .with(csrf()))

                //THEN
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.hobbyId").isNotEmpty())
                .andExpect(jsonPath("$.name").value("Home"))
                .andExpect(jsonPath("$.color").value("blue"));
    }


    @Test
    @DirtiesContext
    @WithMockUser(username = "username", password = "Password123")
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
                        .with(csrf())
                        .content(updatedHobbyJson)
                        .contentType(MediaType.APPLICATION_JSON))

                // THEN
                .andExpect(MockMvcResultMatchers.content().json(expectedJson))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    @DirtiesContext
    @WithMockUser(username = "username", password = "Password123")
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
                        .with(csrf())
                        .param("color", updatedColor)
                        .content(updatedHobbyJson)
                        .contentType(MediaType.APPLICATION_JSON))

                // THEN
                .andExpect(MockMvcResultMatchers.content().json(expectedJson))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }


    @Test
    @DirtiesContext
    @WithMockUser(username = "username", password = "Password123")
    void expectNoHobby_whenDeletingHobby() throws Exception {
        //GIVEN
        String hobbyId = hobby.getHobbyId();

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/hobbies/" + hobbyId).with(csrf()))
                // THEN
                .andExpect(MockMvcResultMatchers.status().isNoContent());

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/hobbies").with(csrf()))
                // THEN
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    @WithMockUser(username = "username", password = "Password123")
    void expectHobby_whenGetHobbyById() throws Exception {
        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/hobbies/hobby/123").with(csrf()))

                //THEN
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(jsonPath("$.hobbyId").isNotEmpty())
                .andExpect(jsonPath("$.name").value("Gardening"))
                .andExpect(jsonPath("$.color").value("green"));
    }

    @Test
    @DirtiesContext
    @WithMockUser(username = "username", password = "Password123")
    void expectEmptyActivitiesList_whenListActivitiesWithNoActivities() throws Exception {
        // GIVEN
        String hobbyId = hobby.getHobbyId();

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/hobbies/hobby/{hobbyId}/activities", hobbyId).with(csrf()))

                // THEN
                .andExpect(MockMvcResultMatchers.status().isOk()).andExpect(content().contentType(MediaType.APPLICATION_JSON)).andExpect(MockMvcResultMatchers.jsonPath("$").isEmpty());
    }

    @Test
    @DirtiesContext
    @WithMockUser(username = "username", password = "Password123")
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
                        """)
                .with(csrf()));

        mockMvc.perform(MockMvcRequestBuilders.post("/api/hobbies/hobby/{hobbyId}/activities", hobbyId)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                            "name": "Pruning",
                            "activityDate": "2023-08-05",
                            "rating": 2,
                            "color": "green"
                        }
                        """)
                .with(csrf()));

        //WHEN & THEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/hobbies/hobby/{hobbyId}/activities", hobbyId).with(csrf()))
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
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].activityId").isNotEmpty())
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
}
