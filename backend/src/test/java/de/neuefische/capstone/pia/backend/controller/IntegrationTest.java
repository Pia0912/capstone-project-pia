package de.neuefische.capstone.pia.backend.controller;

import de.neuefische.capstone.pia.backend.model.Activity;
import de.neuefische.capstone.pia.backend.model.ActivityWithoutID;
import de.neuefische.capstone.pia.backend.model.Hobby;
import de.neuefische.capstone.pia.backend.model.HobbyWithoutID;
import de.neuefische.capstone.pia.backend.repo.HobbyRepo;
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

    @Test
    @DirtiesContext
    void expectHobbyList_whenGettingAllHobbies() throws Exception {
        // GIVEN
        Hobby newHobby = new Hobby(null, "Gardening", new ArrayList<>());
        hobbyRepo.save(newHobby);

        String expected = """
                [
                    {
                        "id": "%s",
                        "name": "Gardening"
                    }
                ]
                """.formatted(newHobby.getId());

        // WHEN & THEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/hobbies")).andExpect(MockMvcResultMatchers.status().isOk()).andExpect(MockMvcResultMatchers.content().json(expected));
    }


    @Test
    @DirtiesContext
    void expectNewHobby_whenPostingHobby() throws Exception {
        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.post("/api/hobbies")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                            "name": "Gardening"
                        }
                        """))
                //THEN
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.name").value("Gardening"));
    }


    @Test
    @DirtiesContext
    void expectUpdatedHobby_whenPuttingHobby() throws Exception {
        //GIVEN
        HobbyWithoutID newHobby = new HobbyWithoutID("Gardening");
        this.hobbyService.addHobby(newHobby);
        String id = hobbyService.getHobbies().get(0).getId();
        String actual = """
                   
                        {
                            "id": "%s",
                            "name": "Cooking"
                         }
                    
                """.formatted(id);
        String expected = """
                   
                        {
                            "id": "%s",
                            "name": "Cooking"
                         }
                    
                """.formatted(id);


        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.put("/api/hobbies/" + id).content(actual).contentType(MediaType.APPLICATION_JSON))

                //THEN
                .andExpect(MockMvcResultMatchers.content().json(expected)).andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    @DirtiesContext
    void expectNoHobby_whenDeletingHobby() throws Exception {
        //GIVEN
        HobbyWithoutID newHobby = new HobbyWithoutID("DIY");
        this.hobbyService.addHobby(newHobby);
        String id = hobbyService.getHobbies().get(0).getId();
        String expected = """
                  []
                """;

        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/hobbies/" + id)).andExpect(MockMvcResultMatchers.status().isOk());
        mockMvc.perform(MockMvcRequestBuilders.get("/api/hobbies"))

                //THEN
                .andExpect(MockMvcResultMatchers.content().json(expected)).andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    @DirtiesContext
    void expectHobbyById_whenGetHobbyById() throws Exception {
        // GIVEN
        HobbyWithoutID newHobby = new HobbyWithoutID("Gardening");
        Hobby addedHobby = this.hobbyService.addHobby(newHobby);
        String id = addedHobby.getId();

        String expectedResponse = """
                    {
                        "id": "%s",
                        "name": "Gardening",
                        "activities": []
                    }
                """.formatted(id);

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/hobbies/{id}", id))

                // THEN
                .andExpect(MockMvcResultMatchers.status().isOk()).andExpect(content().json(expectedResponse));
    }

    @Test
    @DirtiesContext
    void expectEmptyActivitiesList_whenListActivitiesWithNoActivities() throws Exception {
        // GIVEN
        HobbyWithoutID newHobby = new HobbyWithoutID("Gardening");
        Hobby addedHobby = this.hobbyService.addHobby(newHobby);
        String hobbyId = addedHobby.getId();

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/hobbies/{hobbyId}/activities", hobbyId))

                // THEN
                .andExpect(MockMvcResultMatchers.status().isOk()).andExpect(content().contentType(MediaType.APPLICATION_JSON)).andExpect(MockMvcResultMatchers.jsonPath("$").isEmpty());
    }

    @Test
    @DirtiesContext
    void expectActivityAddedToHobby_whenAddActivityToHobby() throws Exception {
        // GIVEN
        HobbyWithoutID newHobby = new HobbyWithoutID("Gardening");
        Hobby addedHobby = this.hobbyService.addHobby(newHobby);
        String hobbyId = addedHobby.getId();

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.post("/api/hobbies/{hobbyId}/activities", hobbyId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                            "name": "Planting Flowers",
                            "date": "2023-07-31"
                        }
                        """))

                // THEN
                .andExpect(MockMvcResultMatchers.status().isOk());

        // ALSO
        mockMvc.perform(MockMvcRequestBuilders.get("/api/hobbies/{hobbyId}/activities", hobbyId))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$").isArray())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].name").value("Planting Flowers"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].date").value("2023-07-31"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].hobbyId").value(hobbyId));
    }

    @Test
    @DirtiesContext
    void expectUpdatedActivity_whenPuttingActivity() throws Exception {
        // GIVEN
        HobbyWithoutID newHobby = new HobbyWithoutID("Gardening");
        Hobby addedHobby = hobbyService.addHobby(newHobby);
        String hobbyId = addedHobby.getId();
        LocalDate activityDate = LocalDate.parse("2023-07-31");

        ActivityWithoutID newActivity = new ActivityWithoutID("Planting Flowers", activityDate, hobbyId, 4);
        Activity addedActivity = hobbyService.addActivityToHobby(hobbyId, newActivity);
        String activityId = addedActivity.getActivityId();

        String actual = """
                {
                    "name": "Watering Flowers",
                    "date": "2023-08-02",
                    "rating": 5
                 }
            """;
        String expected = """
                {
                    "activityId": "%s",
                    "name": "Watering Flowers",
                    "date": "2023-08-02",
                    "rating": 5
                 }
            """.formatted(activityId);

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.put("/api/hobbies/{hobbyId}/activities/{activityId}", hobbyId, activityId)
                        .contentType(MediaType.APPLICATION_JSON).content(actual))

                // THEN
                .andExpect(MockMvcResultMatchers.content().json(expected))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }
}
