package de.neuefische.capstone.pia.backend.controller;

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
    public List<Hobby> listHobbies() {
        return this.hobbyService.list();
    }

    @PostMapping
    public List<Hobby> addHobbby(@RequestBody HobbyWithoutID newHobby){
        this.hobbyService.add(newHobby);
        return this.hobbyService.list();
    }
}

