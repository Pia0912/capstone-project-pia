package de.neuefische.capstone.pia.backend.security;

import de.neuefische.capstone.pia.backend.exceptions.UserNameAlreadyExistsException;
import de.neuefische.capstone.pia.backend.model.UUIDService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class MongoUserDetailsService implements UserDetailsService {

    private final MongoUserRepository mongoUserRepository;

    public MongoUserDetailsService(MongoUserRepository mongoUserRepository) {
        this.mongoUserRepository = mongoUserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        MongoUser mongoUser = mongoUserRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username " + username + " not found!"));

        return new User(mongoUser.username(), mongoUser.password(), Collections.emptyList());
    }

    public void registerNewUser(UserWithoutId userWithoutId) throws UserNameAlreadyExistsException {
        UUIDService uuIdService = new UUIDService();
        PasswordEncoder encoder = Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8();
        String encodedPassword = encoder.encode(userWithoutId.password());
        if (this.mongoUserRepository.findByUsername(userWithoutId.username()).isPresent())
            throw new UserNameAlreadyExistsException("User " + userWithoutId.username() + " already exists!");
        MongoUser newUser = new MongoUser(uuIdService.getRandomId(), userWithoutId.username(), encodedPassword);
        this.mongoUserRepository.save(newUser);
    }

    public UserWithoutPassword getUserWithoutPassword(String username) {
        MongoUser mongoUser = mongoUserRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username " + username + " not found!"));

        return new UserWithoutPassword(mongoUser.userId(), mongoUser.username());
    }
}
