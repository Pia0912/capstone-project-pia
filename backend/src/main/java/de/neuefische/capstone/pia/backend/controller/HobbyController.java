package de.neuefische.capstone.pia.backend.controller;

import de.neuefische.capstone.pia.backend.model.Activity;
import de.neuefische.capstone.pia.backend.model.Hobby;
import de.neuefische.capstone.pia.backend.model.HobbyWithoutID;
import de.neuefische.capstone.pia.backend.service.HobbyService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hobbies")
public class HobbyController {
    private final HobbyService hobbyService;

    public HobbyController(HobbyService hobbyService) {
        this.hobbyService = hobbyService;
    }

    @GetMapping
    public List<Hobby> getHobbies() {
        return this.hobbyService.getHobbies();
    }

    @PostMapping
    public List<Hobby> addHobby(@RequestBody HobbyWithoutID newHobby){
        this.hobbyService.addHobby(newHobby);
        return this.hobbyService.getHobbies();
    }

    @PutMapping("/{id}")
    public Hobby updateHobby(@PathVariable String id, @RequestBody HobbyWithoutID updatedHobby) {
        return hobbyService.updateHobby(id, updatedHobby);
    }

    @DeleteMapping("/{id}")
    public void deleteHobby(@PathVariable String id) {
        hobbyService.deleteHobby(id);
    }

    @GetMapping("/{id}")
    public Hobby getHobbyById(@PathVariable String id) {
        return this.hobbyService.getHobbyById(id);
    }


    @GetMapping("/{hobbyId}/activities")
    public List<Activity> getHobbyByIdListActivities(@PathVariable String hobbyId) {
        Hobby hobby = hobbyService.getHobbyById(hobbyId);
        return hobby.getActivities();
    }

}