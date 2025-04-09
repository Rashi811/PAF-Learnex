package com.skillSharingPlatform.skillSharingPlatform.controller;

import com.skillSharingPlatform.skillSharingPlatform.dto.AuthResponseDTO;
import com.skillSharingPlatform.skillSharingPlatform.dto.LoginDTO;
import com.skillSharingPlatform.skillSharingPlatform.dto.RegisterDTO;
import com.skillSharingPlatform.skillSharingPlatform.model.User;
import com.skillSharingPlatform.skillSharingPlatform.service.AuthService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173") // Allow frontend access
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterDTO registerDTO) {
        User user = authService.register(registerDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(user); // Return 201 Created with the user object
    }

    @PostMapping("/login")
    public AuthResponseDTO login(@RequestBody LoginDTO loginDTO) {
        return authService.login(loginDTO);
    }

    // ✅ Fetch all users
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return authService.getAllUsers();
    }

    // ✅ Fetch user by ID
    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable Long id) {
        return authService.getUserById(id);
    }

    // Update User
    @PutMapping("/userupdate/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody RegisterDTO registerDTO) {
        return authService.updateUser(id, registerDTO);
    }

    // Delete User
    @DeleteMapping("/usersdelete/{id}")
    public void deleteUser(@PathVariable Long id) {
        authService.deleteUser(id);
    }
}
