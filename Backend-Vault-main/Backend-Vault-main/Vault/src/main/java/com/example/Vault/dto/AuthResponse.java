package com.example.Vault.dto;

import com.example.Vault.model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private User user; // Ajouté pour renvoyer les infos de l'utilisateur

    public AuthResponse(String token) {
    }
}
