package de.neuefische.capstone.pia.backend.security;


public record UserWithoutPassword(
        String userId,
        String username
) {
}