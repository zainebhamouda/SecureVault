package com.example.Vault.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class LoginData {
    private String email;
    private String password;
    private String websiteUrl;
    private String note;
}