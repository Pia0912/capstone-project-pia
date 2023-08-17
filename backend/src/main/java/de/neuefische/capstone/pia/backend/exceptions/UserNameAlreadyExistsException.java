package de.neuefische.capstone.pia.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.FORBIDDEN, reason = "Username already exists!")
public class UserNameAlreadyExistsException extends RuntimeException {
    public UserNameAlreadyExistsException(String userName) {
        super("Username already exists: " + userName);

    }
}
