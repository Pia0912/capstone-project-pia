package de.neuefische.capstone.pia.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "Hobby not found!")
public class NoSuchHobbyException extends RuntimeException {
    public NoSuchHobbyException(String id) {
        super("Hobby not found for ID: " + id);
    }
}
