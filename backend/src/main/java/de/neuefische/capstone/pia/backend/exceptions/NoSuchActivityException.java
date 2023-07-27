package de.neuefische.capstone.pia.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "Activities not found!")
public class NoSuchActivityException extends RuntimeException {
    public NoSuchActivityException(String id) {
        super("Activities not found for party with ID: " + id);
    }
}
