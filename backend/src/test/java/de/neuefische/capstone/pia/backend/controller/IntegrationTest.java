package de.neuefische.capstone.pia.backend.controller;

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
        mockMvc.perform(MockMvcRequestBuilders.get("/api/hobbies")).andExpect(MockMvcResultMatchers.status().isOk()).andExpect(MockMvcResultMatchers.content().json(expected));
    }


    @Test
    @DirtiesContext
    void expectNewHobby_whenPostingHobby() throws Exception {
        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.post("/api/hobbies").contentType(MediaType.APPLICATION_JSON).content("""
                        {
                            "name": "Gardening"
                        }
                        """))

                //THEN
                .andExpect(content().contentType(MediaType.APPLICATION_JSON)).andExpect(jsonPath("$[0].id").isNotEmpty()).andExpect(jsonPath("$[0].name").value("Gardening"));
    }

    @Test
    @DirtiesContext
    void expectUpdatedHobby_whenPuttingHobby() throws Exception {
        //GIVEN
        HobbyWithoutID newHobby = new HobbyWithoutID("Gardening");
        this.hobbyService.add(newHobby);
        String id = hobbyService.list().get(0).getId();
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
        this.hobbyService.add(newHobby);
        String id = hobbyService.list().get(0).getId();
        String expected = """
                  []
                """;

        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/hobbies/" + id)).andExpect(MockMvcResultMatchers.status().isOk());
        mockMvc.perform(MockMvcRequestBuilders.get("/api/hobbies"))

                //THEN
                .andExpect(MockMvcResultMatchers.content().json(expected)).andExpect(MockMvcResultMatchers.status().isOk());
    }
}

