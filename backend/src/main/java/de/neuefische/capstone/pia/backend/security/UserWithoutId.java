package de.neuefische.capstone.pia.backend.security;

public record UserWithoutId (
        String username,
        String password
) {
}