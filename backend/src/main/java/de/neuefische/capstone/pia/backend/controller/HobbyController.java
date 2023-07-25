package de.neuefische.capstone.pia.backend.controller;

import de.neuefische.capstone.pia.backend.model.Hobby;
import de.neuefische.capstone.pia.backend.service.HobbyService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}

