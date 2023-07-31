package de.neuefische.capstone.pia.backend.repo;

import de.neuefische.capstone.pia.backend.model.Activity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityRepo extends MongoRepository <Activity, String> {
}
