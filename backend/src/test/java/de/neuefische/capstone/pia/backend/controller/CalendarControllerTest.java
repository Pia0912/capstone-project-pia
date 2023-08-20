package de.neuefische.capstone.pia.backend.controller;

import de.neuefische.capstone.pia.backend.model.Activity;
import de.neuefische.capstone.pia.backend.model.ActivityWithoutID;
import de.neuefische.capstone.pia.backend.model.Hobby;
import de.neuefische.capstone.pia.backend.repo.HobbyRepo;
import de.neuefische.capstone.pia.backend.security.MongoUser;
import de.neuefische.capstone.pia.backend.security.MongoUserRepository;
import de.neuefische.capstone.pia.backend.service.ActivityService;
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

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

@SpringBootTest
@AutoConfigureMockMvc
class CalendarControllerTest {
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
    void expectActivityColor_whenGetActivityByMonth() throws Exception {
        String hobbyId = hobby.getHobbyId();
        LocalDate activityDate = LocalDate.parse("2023-07-31");

        ActivityWithoutID newActivity = new ActivityWithoutID("Planting Flowers", activityDate, hobbyId, 4, "green");
        Activity addedActivity = activityService.addActivityToHobby(hobbyId, newActivity, "green");

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/calendar")
                        .with(csrf())
                        .param("month", "2023-07-01")
                        .contentType(MediaType.APPLICATION_JSON))
                // THEN
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].color").value(addedActivity.getColor()));
    }
}
