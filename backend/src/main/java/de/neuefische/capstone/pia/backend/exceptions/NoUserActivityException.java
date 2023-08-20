package de.neuefische.capstone.pia.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "Activity not found!")
public class NoUserActivityException extends RuntimeException {
    public NoUserActivityException() {
        super("You don't have activities yet, please add some activities");
    }
}
