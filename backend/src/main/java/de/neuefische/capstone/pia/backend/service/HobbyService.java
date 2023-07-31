package de.neuefische.capstone.pia.backend.service;

import de.neuefische.capstone.pia.backend.exceptions.NoSuchHobbyException;
import de.neuefische.capstone.pia.backend.model.Activity;
import de.neuefische.capstone.pia.backend.model.Hobby;
import de.neuefische.capstone.pia.backend.model.HobbyWithoutID;
import de.neuefische.capstone.pia.backend.model.UUIDService;
import de.neuefische.capstone.pia.backend.repo.HobbyRepo;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class HobbyService {
    private final HobbyRepo hobbyRepo;

    private final UUIDService uuidService;

    public HobbyService(HobbyRepo hobbyRepo, UUIDService uuidService) {
        this.hobbyRepo = hobbyRepo;
        this.uuidService = uuidService;
    }

    public List<Hobby> getHobbies() {
        return this.hobbyRepo.findAll();
    }

    public Hobby addHobby(HobbyWithoutID newHobby) {
        String id = uuidService.getRandomId();
        Hobby party = new Hobby(id, newHobby.getName(), new ArrayList<>());
        return this.hobbyRepo.insert(party);
    }
    public Hobby updateHobby(String id, HobbyWithoutID hobbyNoID) {
        Hobby hobby = this.hobbyRepo.findById(id)
                .orElseThrow(() -> new NoSuchHobbyException(id));
        List<Activity> existingActivities = hobby.getActivities();
        Hobby editedHobby = new Hobby(hobby.getId(), hobbyNoID.getName(), existingActivities);
        return this.hobbyRepo.save(editedHobby);
    }
    public void deleteHobby(String id) {
        this.hobbyRepo.deleteById(id);
    }

    public Hobby getHobbyById(String id) {
        return this.hobbyRepo.findById(id).orElseThrow(() -> new NoSuchHobbyException(id));
    }

    public void addActivityToHobby(String hobbyId, Activity activity) {
        Hobby hobby = getHobbyById(hobbyId);
        activity.setHobbyId(hobbyId);
        hobby.addActivity(activity);
        this.hobbyRepo.save(hobby);
    }


}
