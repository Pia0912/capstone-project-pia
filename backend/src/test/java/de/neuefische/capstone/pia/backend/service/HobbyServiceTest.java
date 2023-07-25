package de.neuefische.capstone.pia.backend.service;

import de.neuefische.capstone.pia.backend.model.Hobby;
import de.neuefische.capstone.pia.backend.repo.HobbyRepo;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class HobbyServiceTest {

        HobbyRepo hobbyRepo = mock(HobbyRepo.class);
        HobbyService hobbyService = new HobbyService(hobbyRepo);

        @Test
        void expectListOfAllParties_whenGettingTheList() {
            //GIVEN
            Hobby newHobby = new Hobby(null, "Gardening");
            List<Hobby> expected = new ArrayList<>(List.of(newHobby));

            //WHEN
            when(hobbyRepo.findAll()).thenReturn(expected);
            List<Hobby> actual = hobbyService.list();

            //THEN
            assertEquals(expected, actual);
            verify(hobbyRepo).findAll();
        }
}


