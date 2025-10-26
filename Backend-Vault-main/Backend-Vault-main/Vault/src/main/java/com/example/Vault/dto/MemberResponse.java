package com.example.Vault.dto;

import com.example.Vault.model.UserOrg;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class MemberResponse {
    private Long userId;
    private String userName;
    private String userEmail;
    private UserOrg.UserRole userRole;

    public MemberResponse(Long userId, String userName, String userEmail, UserOrg.UserRole userRole) {
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.userRole = userRole;
    }
}