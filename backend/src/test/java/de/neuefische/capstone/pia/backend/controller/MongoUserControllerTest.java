package de.neuefische.capstone.pia.backend.controller;

import de.neuefische.capstone.pia.backend.security.MongoUser;
import de.neuefische.capstone.pia.backend.security.MongoUserDetailsService;
import de.neuefische.capstone.pia.backend.security.MongoUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.bson.assertions.Assertions.assertNotNull;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
@SpringBootTest
@AutoConfigureMockMvc
class MongoUserControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MongoUserDetailsService mongoUserDetailsService;

    @Autowired
    private MongoUserRepository mongoUserRepository;

    @BeforeEach
    void setUpUsers() {
        MongoUser user = new MongoUser("1", "username", "Password123");
        mongoUserRepository.save(user);
    }


    @Test
    @DirtiesContext
    void expectUserIdIsNull_whenNotLoggedIn() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user")).andExpect(MockMvcResultMatchers.status().isOk()).andExpect(MockMvcResultMatchers.content().string(""));
    }

    @Test
    @DirtiesContext
    @WithMockUser(username = "username", password = "Password123")
    void expectUserId_whenLoggedIn() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user")).andExpect(MockMvcResultMatchers.status().isOk()).andExpect(MockMvcResultMatchers.content().string("1"));
    }

    @Test
    @DirtiesContext
    @WithMockUser(username = "username", password = "Password123")
    void expectAUser_whenLoggedIn() throws Exception {
        String expected = "username";

        mockMvc.perform(MockMvcRequestBuilders.get("/api/user/me"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string(expected));
    }

    @Test
    @DirtiesContext
    void expectAnonymousUser_whenNotLoggedInOnMe() throws Exception {
        String expected = "anonymousUser";

        mockMvc.perform(MockMvcRequestBuilders.get("/api/user/me"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string(expected));
    }

    @Test
    @DirtiesContext
    void register_shouldRegisterNewUser() throws Exception {
        // GIVEN
        String requestBody = """
            {
                "username": "newUser",
                "password": "newPassword"
            }
        """;

        // WHEN & THEN
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(MockMvcResultMatchers.status().isOk());

        UserDetails userDetails = mongoUserDetailsService.loadUserByUsername("newUser");
        assertNotNull(userDetails);
    }

    @Test
    @DirtiesContext
    void expectSuccessfulLogin_whenRegistered() throws Exception {
        //GIVEN
        String registerRequestBody = """
        {
            "username": "testUser",
            "password": "testUserPassword"
        }
    """;

        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/register")
                        .content(registerRequestBody)
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isOk());

        //THEN
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerRequestBody))
                .andExpect(MockMvcResultMatchers.status().isOk());}


    @Test
    void login_shouldReturnAuthenticatedUser() throws Exception {
        // GIVEN
        String requestBody = """
            {
                "username": "testUser",
                "password": "testPassword"
            }
        """;

        // WHEN & THEN
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    @WithMockUser(username = "testUser")
    void logout_shouldLogoutUser() throws Exception {
        // WHEN & THEN
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/logout").with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }


    @Test
    @DirtiesContext
    void expect405_whenRegisteringWithExistingUsername() throws Exception {
        String actual = """
                               
                        {
                            "username": "testUser",
                            "password": "testUserPassword"
                         }
                    
                """;

        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/register").content(actual).contentType(MediaType.APPLICATION_JSON).with(csrf())).andExpect(MockMvcResultMatchers.status().isOk());
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/register").content(actual).contentType(MediaType.APPLICATION_JSON).with(csrf())).andExpect(MockMvcResultMatchers.status().isForbidden());
    }

    @Test
    @DirtiesContext
    @WithMockUser(username = "Pia", password = "123")
    void expectAnonymousUser_whenGettingMeAfterLogout() throws Exception {
        String expected = "anonymousUser";

        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/logout").with(csrf()));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/user/me"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string(expected));
    }
}
