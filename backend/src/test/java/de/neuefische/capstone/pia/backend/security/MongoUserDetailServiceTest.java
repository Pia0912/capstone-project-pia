package de.neuefische.capstone.pia.backend.security;


import de.neuefische.capstone.pia.backend.exceptions.UserNameAlreadyExistsException;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MongoUserDetailServiceTest {

    private final MongoUserRepository userRepository = mock(MongoUserRepository.class);
    private final MongoUserDetailsService userDetailService = new MongoUserDetailsService(userRepository);

    @Test
    void registerNewUser() {
        // GIVEN
        UserWithoutId newUser = new UserWithoutId("John", "newPassword");
        when(userRepository.findByUsername(newUser.username())).thenReturn(Optional.empty());

        // WHEN
        assertDoesNotThrow(() -> userDetailService.registerNewUser(newUser));

        // THEN
        verify(userRepository).save(any(MongoUser.class));
    }

    @Test
    void loadUserByUsername() {
        //GIVEN
        MongoUser expected = new MongoUser("abc", "Henry", "p4ssw0rd");
        String username = "Henry";
        //WHEN
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(expected));
        UserDetails actual = userDetailService.loadUserByUsername("Henry");
        //THEN
        assertEquals(expected.username(), actual.getUsername());
        verify(userRepository).findByUsername(username);
    }

    @Test
    void expectUserWithoutPassword() {
        //GIVEN
        MongoUser expected = new MongoUser("abc", "Henry", "p4ssw0rd");
        String username = "Henry";
        //WHEN
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(expected));
        UserWithoutPassword actual = userDetailService.getUserWithoutPassword(username);
        //THEN
        assertEquals(expected.id(), actual.id());
        verify(userRepository).findByUsername(username);
    }

    @Test
    void registerNewUser_userAlreadyExists() {
        // GIVEN
        UserWithoutId existingUser = new UserWithoutId("Henry", "p4ssw0rd");
        when(userRepository.findByUsername(existingUser.username())).thenReturn(Optional.of(new MongoUser("abc", existingUser.username(), existingUser.password())));

        // WHEN & THEN
        assertThrows(UserNameAlreadyExistsException.class, () -> userDetailService.registerNewUser(existingUser));
    }

}