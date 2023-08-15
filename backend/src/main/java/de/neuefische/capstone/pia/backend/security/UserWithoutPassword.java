package de.neuefische.capstone.pia.backend.security;


public record UserWithoutPassword(
        String id,
        String username
) {
}