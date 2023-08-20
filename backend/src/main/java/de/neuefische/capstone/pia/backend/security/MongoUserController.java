package de.neuefische.capstone.pia.backend.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user")
public class MongoUserController {

    private final MongoUserDetailsService mongoUserDetailsService;

    @GetMapping
    public String getUserId() {
        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        if (!username.equals("anonymousUser")) {
            return this.mongoUserDetailsService.getUserName(username).userId();
        }
        return null;
    }

    @GetMapping("/me")
    public String getUserName() {
        return SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
    }

    @PostMapping("/register")
    public void register(@RequestBody UserWithoutId userWithoutId){
        this.mongoUserDetailsService.registerNewUser(userWithoutId);
    }

    @PostMapping("/login")
    public String login() {
        return SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
    }

    @PostMapping("/logout")
    public void logout(Authentication authentication, HttpServletRequest request, HttpServletResponse response) {
        SecurityContextLogoutHandler logoutHandler = new SecurityContextLogoutHandler();
        logoutHandler.logout(request, response, authentication);
    }
}
