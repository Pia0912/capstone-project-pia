package de.neuefische.capstone.pia.backend.security;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("users")
public record MongoUser(
        @Id
        String userId,
        String username,
        String password
) {

}
