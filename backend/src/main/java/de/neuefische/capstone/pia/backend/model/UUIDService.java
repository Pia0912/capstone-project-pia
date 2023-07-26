package de.neuefische.capstone.pia.backend.model;

import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UUIDService {
        public String getRandomId(){
            return UUID.randomUUID().toString();
        }

}
