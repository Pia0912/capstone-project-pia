package de.neuefische.capstone.pia.backend.repo;

import de.neuefische.capstone.pia.backend.model.Hobby;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HobbyRepo extends MongoRepository <Hobby, String> {
List<Hobby> findAllByAuthorId(String authorId);

}

