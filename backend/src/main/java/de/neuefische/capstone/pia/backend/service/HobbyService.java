package de.neuefische.capstone.pia.backend.service;

import de.neuefische.capstone.pia.backend.exceptions.NoSuchHobbyException;
import de.neuefische.capstone.pia.backend.model.*;
import de.neuefische.capstone.pia.backend.repo.HobbyRepo;
import org.springframework.stereotype.Service;
import java.util.*;


@Service
public class HobbyService {
    private final HobbyRepo hobbyRepo;
    private final UUIDService uuidService;

    public HobbyService(HobbyRepo hobbyRepo, UUIDService uuidService) {
        this.hobbyRepo = hobbyRepo;
        this.uuidService = uuidService;
    }

    public List<Hobby> getHobbies() {
        return hobbyRepo.findAll();
    }

    public Hobby addHobby(HobbyAddModel newHobby) {
        String id = uuidService.getRandomId();
        Hobby hobby = new Hobby(id, newHobby.getName(), newHobby.getColor(), new ArrayList<>());
        return hobbyRepo.insert(hobby);
    }

    public Hobby updateHobby(String id, HobbyAddModel hobbyNoID, String newColor) {
        Hobby hobby = hobbyRepo.findById(id)
                .orElseThrow(() -> new NoSuchHobbyException(id));
        hobby.setName(hobbyNoID.getName());
        if (newColor != null) {
            hobby.setColor(newColor);
        }
        return hobbyRepo.save(hobby);
    }

    public void deleteHobby(String id) {
        hobbyRepo.deleteById(id);
    }

    public Hobby getHobbyById(String hobbyId) {
        return hobbyRepo.findById(hobbyId).orElseThrow(() -> new NoSuchHobbyException(hobbyId));
    }

    public Hobby updateHobbyColor(String id, String color) {
        Hobby hobby = hobbyRepo.findById(id)
                .orElseThrow(() -> new NoSuchHobbyException(id));
        hobby.setColor(color);
        return hobbyRepo.save(hobby);
    }

}
