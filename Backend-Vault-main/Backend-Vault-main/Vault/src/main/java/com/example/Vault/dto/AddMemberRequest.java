package com.example.Vault.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AddMemberRequest {
    private String userEmail;
    private String userRole; // "OWNER" ou "MEMBER"
}
