package de.neuefische.capstone.pia.backend.service;

import de.neuefische.capstone.pia.backend.model.Hobby;
import de.neuefische.capstone.pia.backend.repo.HobbyRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HobbyService {
    private final HobbyRepo hobbyRepo;

    public HobbyService(HobbyRepo hobbyRepo) {
        this.hobbyRepo = hobbyRepo;
    }

    public List<Hobby> list() {
        return this.hobbyRepo.findAll();
    }
}
