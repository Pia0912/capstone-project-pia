package de.neuefische.capstone.pia.backend.service;

import de.neuefische.capstone.pia.backend.exceptions.NoSuchHobbyException;
import de.neuefische.capstone.pia.backend.model.*;
import de.neuefische.capstone.pia.backend.repo.HobbyRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class HobbyServiceTest {

    HobbyRepo hobbyRepo;
    UUIDService uuidService;
    HobbyService hobbyService;
    @BeforeEach
    public void setup() {
        hobbyRepo = mock(HobbyRepo.class);
        uuidService = mock(UUIDService.class);
        hobbyService = new HobbyService(hobbyRepo, uuidService);
    }
    @Test
    void expectEmptyList_whenNoHobbiesExist() {
        // GIVEN
        when(hobbyRepo.findAll()).thenReturn(Collections.emptyList());

        // WHEN
        List<Hobby> actual = hobbyService.getHobbies();

        // THEN
        assertEquals(Collections.emptyList(), actual);
        verify(hobbyRepo).findAll();
    }

    @Test
    void expectListOfAllHobbies_whenGettingTheList() {
        //GIVEN
        Hobby newHobby = new Hobby(null, "Gardening", "green", new ArrayList<>());
        List<Hobby> expected = new ArrayList<>(List.of(newHobby));

        //WHEN
        when(hobbyRepo.findAll()).thenReturn(expected);
        List<Hobby> actual = hobbyService.getHobbies();

        //THEN
        assertEquals(expected, actual);
        verify(hobbyRepo).findAll();
    }


    @Test
    void expectId_whenAddedHobby() {
        // GIVEN
        HobbyAddModel newHobbyNoId = new HobbyAddModel("gardening", "green");
        Hobby expected = new Hobby("abc", "gardening", "green", new ArrayList<>());

        // WHEN
        when(uuidService.getRandomId()).thenReturn("abc");
        when(hobbyRepo.insert(any(Hobby.class))).thenReturn(expected);

        Hobby actual = hobbyService.addHobby(newHobbyNoId);

        // THEN
        assertEquals(expected, actual);
        verify(uuidService).getRandomId();
        verify(hobbyRepo).insert(any(Hobby.class));
    }

    @Test
    void updateHobbyName_WhenPuttingHobby() {
        // GIVEN
        String hobbyId = "existingHobbyId";
        String newHobbyName = "Updated Gardening";

        HobbyAddModel updatedHobby = new HobbyAddModel(newHobbyName, "newColorValue");
        Hobby existingHobby = new Hobby(hobbyId, "Gardening", "green", new ArrayList<>());

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
        Hobby existingHobby = new Hobby(hobbyId, "Gardening", "green", new ArrayList<>());

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
        Hobby existingHobby = new Hobby(hobbyId, "Gardening", "green", null);

        HobbyRepo hobbyRepo = mock(HobbyRepo.class);
        when(hobbyRepo.findById(hobbyId)).thenReturn(Optional.of(existingHobby));

        HobbyService hobbyService = new HobbyService(hobbyRepo, null);

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
