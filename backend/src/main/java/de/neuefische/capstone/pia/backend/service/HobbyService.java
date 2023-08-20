package de.neuefische.capstone.pia.backend.service;

import de.neuefische.capstone.pia.backend.exceptions.NoSuchHobbyException;
import de.neuefische.capstone.pia.backend.exceptions.UnauthorizedAccessException;
import de.neuefische.capstone.pia.backend.model.*;
import de.neuefische.capstone.pia.backend.repo.HobbyRepo;
import de.neuefische.capstone.pia.backend.security.MongoUser;
import de.neuefische.capstone.pia.backend.security.MongoUserService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.*;



@Service
public class HobbyService {
    private final HobbyRepo hobbyRepo;
    private final UUIDService uuidService;

    private final MongoUserService mongoUserService;

    public HobbyService(HobbyRepo hobbyRepo, UUIDService uuidService, MongoUserService mongoUserService) {
        this.hobbyRepo = hobbyRepo;
        this.uuidService = uuidService;
        this.mongoUserService = mongoUserService;
    }

    public List<Hobby> getHobbies() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        MongoUser user = mongoUserService.findUserByUsername(username);

        return hobbyRepo.findAllByAuthorId(user.userId());
    }

    public Hobby addHobby(HobbyAddModel newHobby) {
        String id = uuidService.getRandomId();
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        MongoUser user = mongoUserService.findUserByUsername(username);

        Hobby hobby = new Hobby(id, newHobby.getName(), newHobby.getColor(), new ArrayList<>(), user.userId());
        return hobbyRepo.insert(hobby);
    }

    public Hobby getHobbyWithUserPermission(String id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        MongoUser user = mongoUserService.findUserByUsername(username);

        Hobby hobby = hobbyRepo.findById(id)
                .orElseThrow(() -> new NoSuchHobbyException(id));

        if (!hobby.getAuthorId().equals(user.userId())) {
            throw new UnauthorizedAccessException();
        }
        return hobby;
    }

    public Hobby updateHobby(String id, HobbyAddModel hobbyNoID) {
        Hobby hobby = getHobbyWithUserPermission(id);
        hobby.setName(hobbyNoID.getName());
        return hobbyRepo.save(hobby);
    }

    public Hobby updateHobbyColor(String id, String color) {
        Hobby hobby = getHobbyWithUserPermission(id);
        hobby.setColor(color);
        return hobbyRepo.save(hobby);
    }

    public void deleteHobby(String id) {
        getHobbyWithUserPermission(id);
        hobbyRepo.deleteById(id);
    }

    public Hobby getHobbyById(String hobbyId) {
        return hobbyRepo.findById(hobbyId).orElseThrow(() -> new NoSuchHobbyException(hobbyId));
    }
}
