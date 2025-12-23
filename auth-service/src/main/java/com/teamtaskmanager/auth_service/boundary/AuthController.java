package com.teamtaskmanager.auth_service.boundary;

import com.teamtaskmanager.auth_service.control.JwtUtil;
import com.teamtaskmanager.auth_service.control.UserRepository;
import com.teamtaskmanager.auth_service.entity.AuthResponse;
import com.teamtaskmanager.auth_service.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    public AuthController(UserRepository repository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        repository.save(user);
        return ResponseEntity.ok(Collections.singletonMap("message", "User created successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> getToken(@RequestBody User user) {
        User existingUser = repository.findByUsername(user.getUsername()).orElse(null);

        if (existingUser != null && passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
            String token = jwtUtil.generateToken(user.getUsername());
            return ResponseEntity.ok(new AuthResponse(token));
        } else {
            return ResponseEntity.status(401).body(Collections.singletonMap("error", "Invalid username or password"));
        }
    }
}
