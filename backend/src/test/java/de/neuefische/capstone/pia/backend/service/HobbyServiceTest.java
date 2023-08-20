package de.neuefische.capstone.pia.backend.service;

import de.neuefische.capstone.pia.backend.exceptions.NoSuchHobbyException;
import de.neuefische.capstone.pia.backend.exceptions.UnauthorizedAccessException;
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
        Hobby expected = new Hobby("123", "Home", "green", new ArrayList<>(), user.userId());

        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(authentication.getName()).thenReturn(username);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        when(uuidService.getRandomId()).thenReturn("123");
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
    void getHobbyWithUserPermission_ShouldReturnHobbyWhenUserHasPermission() {
        // GIVEN
        String hobbyId = "existingHobbyId";
        String username = "username";

        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(authentication.getName()).thenReturn(username);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        MongoUser user = new MongoUser("user1", username, "Password123");
        when(mongoUserService.findUserByUsername(username)).thenReturn(user);

        Hobby existingHobby = new Hobby(hobbyId, "Gardening", "green", new ArrayList<>(), "user1");
        when(hobbyRepo.findById(hobbyId)).thenReturn(Optional.of(existingHobby));

        // WHEN
        Hobby result = hobbyService.getHobbyWithUserPermission(hobbyId);

        // THEN
        assertEquals(existingHobby, result);
        verify(authentication).getName();
        verify(securityContext).getAuthentication();
        verify(mongoUserService).findUserByUsername(username);
        verify(hobbyRepo).findById(hobbyId);
    }

    @Test
    void getHobbyWithUserPermission_ShouldThrowUnauthorizedAccessExceptionWhenUserDoesNotHavePermission() {
        // GIVEN
        String hobbyId = "existingHobbyId";
        String username = "username";

        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(authentication.getName()).thenReturn(username);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        MongoUser user = new MongoUser("user2", username, "Password123");
        when(mongoUserService.findUserByUsername(username)).thenReturn(user);

        Hobby existingHobby = new Hobby(hobbyId, "Gardening", "green", new ArrayList<>(), "user1");
        when(hobbyRepo.findById(hobbyId)).thenReturn(Optional.of(existingHobby));

        //WHEN & THEN
        assertThrows(UnauthorizedAccessException.class, () -> hobbyService.getHobbyWithUserPermission(hobbyId));

        verify(authentication).getName();
        verify(securityContext).getAuthentication();
        verify(mongoUserService).findUserByUsername(username);
        verify(hobbyRepo).findById(hobbyId);
    }

    @Test
    void updateHobby_ShouldUpdateHobbyNameAndReturnUpdatedHobby() {
        // GIVEN
        String hobbyId = "existingHobbyId";
        String newHobbyName = "Updated Gardening";

        HobbyAddModel updatedHobby = new HobbyAddModel(newHobbyName, "newColorValue");
        Hobby existingHobby = new Hobby(hobbyId, "Gardening", "green", new ArrayList<>(), "user1");

        //WHEN
        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(authentication.getName()).thenReturn("username");
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        when(hobbyRepo.findById(hobbyId)).thenReturn(Optional.of(existingHobby));
        when(hobbyRepo.save(any(Hobby.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MongoUser user = new MongoUser("user1", "username", "Password123");
        when(mongoUserService.findUserByUsername("username")).thenReturn(user);

        // WHEN
        Hobby result = hobbyService.updateHobby(hobbyId, updatedHobby);

        // THEN
        assertEquals(newHobbyName, result.getName());
        assertEquals(existingHobby.getColor(), result.getColor());
        verify(hobbyRepo).findById(hobbyId);
        verify(hobbyRepo).save(existingHobby);
        verify(mongoUserService).findUserByUsername("username");
    }



    @Test
    void updateHobbyColor_ShouldUpdateHobbyColorAndReturnUpdatedHobby() {
        // GIVEN
        String hobbyId = "existingHobbyId";
        String newColor = "blue";
        Hobby existingHobby = new Hobby(hobbyId, "Gardening", "green", new ArrayList<>(), "user1");

        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(authentication.getName()).thenReturn("username");
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        when(hobbyRepo.findById(hobbyId)).thenReturn(Optional.of(existingHobby));
        when(hobbyRepo.save(any(Hobby.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MongoUser user = new MongoUser("user1", "username", "Password123");
        when(mongoUserService.findUserByUsername("username")).thenReturn(user);

        // WHEN
        Hobby result = hobbyService.updateHobbyColor(hobbyId, newColor);

        // THEN
        assertEquals(newColor, result.getColor());
        verify(hobbyRepo).findById(hobbyId);
        verify(hobbyRepo).save(existingHobby);
        verify(mongoUserService).findUserByUsername("username");
    }



    @Test
    void deleteHobby_ShouldDeleteHobbyWhenUserHasPermission() {
        // GIVEN
        String hobbyId = "existingHobbyId";
        Hobby existingHobby = new Hobby(hobbyId, "Gardening", "green", new ArrayList<>(), "user1");

        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(authentication.getName()).thenReturn("username");
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        MongoUser user = new MongoUser("user1", "username", "Password123");
        when(mongoUserService.findUserByUsername("username")).thenReturn(user);

        when(hobbyRepo.findById(hobbyId)).thenReturn(Optional.of(existingHobby));
        doNothing().when(hobbyRepo).deleteById(hobbyId);

        // WHEN
        hobbyService.deleteHobby(hobbyId);

        // THEN
        verify(hobbyRepo).findById(hobbyId);
        verify(hobbyRepo).deleteById(hobbyId);
        verify(mongoUserService).findUserByUsername("username");
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
