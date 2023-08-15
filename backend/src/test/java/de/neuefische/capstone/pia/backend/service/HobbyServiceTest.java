package de.neuefische.capstone.pia.backend.service;

import de.neuefische.capstone.pia.backend.exceptions.NoSuchHobbyException;
import de.neuefische.capstone.pia.backend.model.*;
import de.neuefische.capstone.pia.backend.repo.HobbyRepo;
import de.neuefische.capstone.pia.backend.security.MongoUser;
import de.neuefische.capstone.pia.backend.security.MongoUserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class HobbyServiceTest {

    HobbyRepo hobbyRepo;
    UUIDService uuidService;
    HobbyService hobbyService;
    MongoUserService mongoUserService;
    SecurityContext securityContext;

    Authentication authentication;


    @BeforeEach
    public void setup() {
        hobbyRepo = mock(HobbyRepo.class);
        uuidService = mock(UUIDService.class);
        mongoUserService = mock(MongoUserService.class);
        securityContext = mock(SecurityContext.class);
        authentication = mock(Authentication.class);
        hobbyService = new HobbyService(hobbyRepo, uuidService, mongoUserService);
    }
    @Test
    void expectEmptyList_whenNoHobbiesExist() {
        // GIVEN
        String username = "username";
        String userId = "1";
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getName()).thenReturn(username);
        when(mongoUserService.findUserByUsername(username)).thenReturn(new MongoUser("1", username, "Password123")); // Mock the mongoUserService to return a non-null user

        when(hobbyRepo.findAllByAuthorId(userId)).thenReturn(Collections.emptyList());

        // WHEN
        List<Hobby> actual = hobbyService.getHobbies();

        // THEN
        assertEquals(Collections.emptyList(), actual);
        verify(hobbyRepo).findAllByAuthorId(userId);
    }

    @Test
    void expectListOfUserHobbies_whenGettingHobbies() {
        // GIVEN
        String username = "username";
        String userId = "1";
        List<Hobby> userHobbies = new ArrayList<>();
        userHobbies.add(new Hobby("123", "Home", "green", new ArrayList<>(), userId));

        when(authentication.getName()).thenReturn(username);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        MongoUser user = new MongoUser(userId, username, "Password123");
        when(mongoUserService.findUserByUsername(username)).thenReturn(user);

        when(hobbyRepo.findAllByAuthorId(userId)).thenReturn(userHobbies);

        // WHEN
        List<Hobby> actualHobbies = hobbyService.getHobbies();

        // THEN
        assertEquals(userHobbies, actualHobbies);
        verify(mongoUserService).findUserByUsername(username);
        verify(hobbyRepo).findAllByAuthorId(userId);
    }


    @Test
    void expectNewHobby_whenAddHobby() {
        // GIVEN
        String username = "username";
        MongoUser user = new MongoUser("1", username, "Password123");
        HobbyAddModel newHobby = new HobbyAddModel("Home", "red");
        Hobby expected = new Hobby("123", "Home", "green", new ArrayList<>(), user.id());

        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(authentication.getName()).thenReturn(username);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        when(uuidService.getRandomId()).thenReturn("123"); // Use the actual ID you expect
        when(hobbyRepo.insert(any(Hobby.class))).thenReturn(expected);
        when(mongoUserService.findUserByUsername(username)).thenReturn(user);

        // WHEN
        Hobby actual = hobbyService.addHobby(newHobby);

        // THEN
        assertEquals(expected, actual);
        verify(uuidService).getRandomId();
        verify(hobbyRepo).insert(any(Hobby.class));
        verify(mongoUserService).findUserByUsername(username);
    }

    @Test
    void updateHobbyName_WhenPuttingHobby() {
        // GIVEN
        String hobbyId = "existingHobbyId";
        String newHobbyName = "Updated Gardening";

        HobbyAddModel updatedHobby = new HobbyAddModel(newHobbyName, "newColorValue");
        Hobby existingHobby = new Hobby(hobbyId, "Gardening", "green", new ArrayList<>(), "user1");

        when(hobbyRepo.findById(hobbyId)).thenReturn(Optional.of(existingHobby));
        when(hobbyRepo.save(any(Hobby.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // WHEN
        Hobby result = hobbyService.updateHobby(hobbyId, updatedHobby, "newColorValue");

        // THEN
        assertEquals(newHobbyName, result.getName());
        assertEquals(existingHobby.getColor(), result.getColor());
        verify(hobbyRepo).findById(hobbyId);
        verify(hobbyRepo).save(existingHobby);
    }

    @Test
    void updateHobbyColor_ShouldUpdateHobbyColorAndReturnUpdatedHobby() {
        // GIVEN
        String hobbyId = "existingHobbyId";
        String newColor = "blue";
        Hobby existingHobby = new Hobby(hobbyId, "Gardening", "green", new ArrayList<>(), "user1");

        when(hobbyRepo.findById(hobbyId)).thenReturn(Optional.of(existingHobby));
        when(hobbyRepo.save(any(Hobby.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // WHEN
        Hobby result = hobbyService.updateHobbyColor(hobbyId, newColor);

        // THEN
        assertEquals(newColor, result.getColor());
        verify(hobbyRepo).findById(hobbyId);
        verify(hobbyRepo).save(existingHobby);
    }

    @Test
    void expectDeleteMethodToBeCalled_whenDeletingHobby() {
        //GIVEN
        String id = "abc";
        //WHEN
        hobbyService.deleteHobby(id);
        //THEN
        verify(hobbyRepo).deleteById(id);
    }

    @Test
    void getDetails_ExistingHobby_ShouldReturnHobby() {
        // GIVEN
        String hobbyId = "existingHobbyId";
        Hobby existingHobby = new Hobby(hobbyId, "Gardening", "green", null, "user1");

        HobbyRepo hobbyRepo = mock(HobbyRepo.class);
        when(hobbyRepo.findById(hobbyId)).thenReturn(Optional.of(existingHobby));

        HobbyService hobbyService = new HobbyService(hobbyRepo, null, mongoUserService);

        // WHEN
        Hobby result = hobbyService.getHobbyById(hobbyId);

        // THEN
        assertEquals(existingHobby, result);
    }
    @Test
    void expectNoSuchHobbyException_whenHobbyIdNotFound() {
        // GIVEN
        String nonExistentActivityId = "abc";
        when(hobbyRepo.findById(nonExistentActivityId)).thenReturn(Optional.empty());

        // WHEN & THEN
        assertThrows(NoSuchHobbyException.class, () -> hobbyService.getHobbyById(nonExistentActivityId));
    }

}
