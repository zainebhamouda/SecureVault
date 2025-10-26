package com.example.Vault.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SignupRequest {
    private String userName; // Changé de 'name' à 'userName'
    private String userEmail; // Changé de 'email' à 'userEmail'
    private String userPassword; // Changé de 'password' à 'userPassword'
}