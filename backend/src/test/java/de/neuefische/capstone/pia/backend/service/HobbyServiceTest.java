package de.neuefische.capstone.pia.backend.service;

import de.neuefische.capstone.pia.backend.exceptions.NoSuchHobbyException;
import de.neuefische.capstone.pia.backend.model.Hobby;
import de.neuefische.capstone.pia.backend.model.HobbyWithoutID;
import de.neuefische.capstone.pia.backend.model.UUIDService;
import de.neuefische.capstone.pia.backend.repo.HobbyRepo;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class HobbyServiceTest {

    HobbyRepo hobbyRepo = mock(HobbyRepo.class);
    UUIDService uuidService = mock(UUIDService.class);
    HobbyService hobbyService = new HobbyService(hobbyRepo, uuidService);

    @Test
    void expectListOfAllParties_whenGettingTheList() {
        //GIVEN
        Hobby newHobby = new Hobby(null, "Gardening", new ArrayList<>());
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
        HobbyWithoutID newHobbyNoId = new HobbyWithoutID("gardening");
        Hobby expected = new Hobby("abc", "gardening", new ArrayList<>());

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
        Hobby existingHobby = new Hobby(hobbyId, "Gardening", null);

        HobbyRepo hobbyRepo = mock(HobbyRepo.class);
        when(hobbyRepo.findById(hobbyId)).thenReturn(Optional.of(existingHobby));

        HobbyService hobbyService = new HobbyService(hobbyRepo, null);

        // WHEN
        Hobby result = hobbyService.getHobbyById(hobbyId);

        // THEN
        assertEquals(existingHobby, result);
    }
    @Test
    void expectNoSuchActivityException_whenActivityNotFound() {
        // GIVEN
        String nonExistentActivityId = "abc";
        when(hobbyRepo.findById(nonExistentActivityId)).thenReturn(Optional.empty());

        // WHEN & THEN
        assertThrows(NoSuchHobbyException.class, () -> hobbyService.getHobbyById(nonExistentActivityId));
    }

}
