package com.skillSharingPlatform.skillSharingPlatform.controller;

import com.skillSharingPlatform.skillSharingPlatform.model.Admin;
import com.skillSharingPlatform.skillSharingPlatform.model.User;
import com.skillSharingPlatform.skillSharingPlatform.repository.AdminRepository;
import com.skillSharingPlatform.skillSharingPlatform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private UserRepository userRepository;

    // 1️⃣ Admin Registration
    @PostMapping("/register")
    public ResponseEntity<String> registerAdmin(@RequestBody Admin admin) {
        adminRepository.save(admin);
        return ResponseEntity.ok("Admin registered successfully");
    }

    // 4️⃣ Get All Users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // 5️⃣ Delete User
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        userRepository.deleteById(userId);
        return ResponseEntity.ok("User deleted successfully");
    }
}
