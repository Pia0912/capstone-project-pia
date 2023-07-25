package de.neuefische.capstone.pia.backend.repo;

import de.neuefische.capstone.pia.backend.model.Hobby;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface HobbyRepo extends MongoRepository <Hobby, String> {
}
