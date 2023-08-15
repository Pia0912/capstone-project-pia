package de.neuefische.capstone.pia.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MongoUserService {

    public final MongoUserRepository mongoUserRepository;

    public MongoUser findUserByUsername(String username) {
        return mongoUserRepository.findByUsername(username).orElseThrow();
    }
}
