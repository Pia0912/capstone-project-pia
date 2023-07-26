package de.neuefische.capstone.pia.backend.controller;

import de.neuefische.capstone.pia.backend.model.Hobby;
import de.neuefische.capstone.pia.backend.repo.HobbyRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
class IntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private HobbyRepo hobbyRepo;

    @Test
    @DirtiesContext
    void expectHobbyList_whenGettingAllHobbies() throws Exception {
        // GIVEN
        Hobby newHobby = new Hobby(null, "Gardening");
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
        mockMvc.perform(MockMvcRequestBuilders.get("/api/hobbies"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(expected));
    }


    @Test
    void expectNewHobby_whenPostingHobby() throws Exception {
        //WHEN
        mockMvc.perform(
                        MockMvcRequestBuilders.post("/api/hobbies")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "name": "Gardening"
                                        }
                                        """
                                )
                )

                //THEN
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").isNotEmpty())
                .andExpect(jsonPath("$[0].name").value("Gardening"));
    }
}
