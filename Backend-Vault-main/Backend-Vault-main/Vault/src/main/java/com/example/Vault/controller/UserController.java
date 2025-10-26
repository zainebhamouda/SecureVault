package com.example.Vault.controller;

import com.example.Vault.model.User;
import com.example.Vault.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    // -----------------------
    // Login / Signup
    // -----------------------

    public static class LoginRequest {
        public String userEmail;
        public String userPassword;
    }

    public static class AuthResponse {
        public String token;
        public String userEmail;
        public String userName;

        public AuthResponse(String token, String userEmail, String userName) {
            this.token = token;
            this.userEmail = userEmail;
            this.userName = userName;
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        User user = userService.getUserByEmail(request.userEmail);

        if (!passwordEncoder.matches(request.userPassword, user.getUserPassword())) {
            return ResponseEntity.status(401).build();
        }

        // Générer token (ici exemple simple)
        String token = "dummy-token";

        return ResponseEntity.ok(new AuthResponse(token, user.getUserEmail(), user.getUserName()));
    }

    @PostMapping("/signup")
    public ResponseEntity<User> signup(@RequestBody User user) {
        User newUser = userService.registerUser(user);
        return ResponseEntity.ok(newUser);
    }

    // -----------------------
    // CRUD existants
    // -----------------------

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUser(id));
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        return ResponseEntity.ok(userService.updateUser(id, userDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/email/{email}")
    public ResponseEntity<User> updateUserByEmail(@PathVariable String email, @RequestBody User userDetails) {
        User user = userService.getUserByEmail(email);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        user.setUserName(userDetails.getUserName());
        user.setUserEmail(userDetails.getUserEmail());

        User updatedUser = userService.updateUser(user); // Crée une méthode updateUser(User user)
        return ResponseEntity.ok(updatedUser);
    }


}
