package de.neuefische.capstone.pia.backend.controller;

import de.neuefische.capstone.pia.backend.model.Activity;
import de.neuefische.capstone.pia.backend.repo.ActivityRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.time.LocalDate;

@SpringBootTest
@AutoConfigureMockMvc
class TestActivityController {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ActivityRepo activityRepo;

        @Test
        @DirtiesContext
        void expectActivityList_whenGettingAllActivities() throws Exception {
                // GIVEN
                Activity newActivity = new Activity(null, "Water plants", LocalDate.now(), "Garden");
                activityRepo.save(newActivity);

                String expected = """
                [
                    {
                        "id": "%s",
                        "name": "Water plants",
                        "date": "%s",
                        "hobbyId": "Garden"
                    }
                ]
                """.formatted(newActivity.getId(), LocalDate.now());

                // WHEN & THEN
                mockMvc.perform(MockMvcRequestBuilders.get("/api/activities"))
                        .andExpect(MockMvcResultMatchers.status().isOk())
                        .andExpect(MockMvcResultMatchers.content().json(expected));
        }

}
