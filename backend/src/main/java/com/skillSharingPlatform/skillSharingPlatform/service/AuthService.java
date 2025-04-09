package com.skillSharingPlatform.skillSharingPlatform.service;

import com.skillSharingPlatform.skillSharingPlatform.dto.AuthResponseDTO;
import com.skillSharingPlatform.skillSharingPlatform.dto.LoginDTO;
import com.skillSharingPlatform.skillSharingPlatform.dto.RegisterDTO;
import com.skillSharingPlatform.skillSharingPlatform.model.User;
import com.skillSharingPlatform.skillSharingPlatform.repository.UserRepository;
import com.skillSharingPlatform.skillSharingPlatform.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    public User register(RegisterDTO registerDTO) {
        if (userRepository.existsByUsername(registerDTO.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }
        if (userRepository.existsByEmail(registerDTO.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
    
        User user = new User();
        user.setUsername(registerDTO.getUsername());
        user.setEmail(registerDTO.getEmail());
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        user.setName(registerDTO.getName());
        userRepository.save(user);
    
        return user;  // Return the user object after successful registration
    }
    

    public AuthResponseDTO login(LoginDTO loginDTO) {
        // Authenticate the user with the provided credentials
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword()));
    
        // Retrieve the user from the database based on the username
        User user = userRepository.findByUsername(loginDTO.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found!"));
    
        // Generate JWT token using the username
        String token = jwtUtil.generateToken(user.getUsername());
    
        // Return the AuthResponseDTO containing both the JWT token and user details
        return new AuthResponseDTO(token, user);
    }
    

    // ✅ Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ Get user by ID
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }


    public User updateUser(Long id, RegisterDTO registerDTO) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

        // Update the fields
        existingUser.setUsername(registerDTO.getUsername());
        existingUser.setEmail(registerDTO.getEmail());
        existingUser.setPassword(passwordEncoder.encode(registerDTO.getPassword())); // if you want to update the password
        existingUser.setName(registerDTO.getName());

        // Save the updated user
        return userRepository.save(existingUser);
    }
    public void deleteUser(Long id) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

        userRepository.delete(existingUser);
    }


}
