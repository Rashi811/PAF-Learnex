package com.skillSharingPlatform.skillSharingPlatform.dto;

import lombok.Getter;
import lombok.Setter;



public class RegisterDTO {
    private String username;
    private String email;
    private String password;
    private String name;

    // Getter methods
    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getName() {
        return name;
    }

    // Setter methods
    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setName(String name) {
        this.name = name;
    }
}
