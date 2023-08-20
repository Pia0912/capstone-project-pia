package de.neuefische.capstone.pia.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.UNAUTHORIZED, reason = "Unauthorized Action!")
public class UnauthorizedAccessException extends RuntimeException {
    public UnauthorizedAccessException() {
        super("You don't have access to this object");
    }
}
