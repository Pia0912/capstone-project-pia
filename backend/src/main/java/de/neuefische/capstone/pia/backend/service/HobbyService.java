package de.neuefische.capstone.pia.backend.service;

import de.neuefische.capstone.pia.backend.exceptions.NoSuchActivityException;
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

    public List<Hobby> list() {
        return this.hobbyRepo.findAll();
    }

    public Hobby add(HobbyWithoutID newHobby) {
        String id = uuidService.getRandomId();
        Hobby party = new Hobby(id, newHobby.getName(), new ArrayList<>());
        return this.hobbyRepo.insert(party);
    }
    public Hobby edit(String id, HobbyWithoutID hobby) {
        Hobby editedHobby = new Hobby(id, hobby.getName(), new ArrayList<>());
        return this.hobbyRepo.save(editedHobby);
    }
    public void delete(String id) {
        this.hobbyRepo.deleteById(id);
    }

    public Hobby getDetails(String id) {
        return this.hobbyRepo.findById(id).orElseThrow(() -> new NoSuchActivityException(id));
    }
}
