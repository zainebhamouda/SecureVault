package com.example.Vault.dto;

import com.example.Vault.model.UserOrg;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class OrganisationResponse {
    private Long orgId;
    private String orgName;
    private Integer membersCount;
    private LocalDateTime createdAt;
    private UserOrg.UserRole userRole; // Rôle de l'utilisateur actuel dans cette organisation

    public OrganisationResponse(Long orgId, String orgName, Integer membersCount,
                                LocalDateTime createdAt, UserOrg.UserRole userRole) {
        this.orgId = orgId;
        this.orgName = orgName;
        this.membersCount = membersCount;
        this.createdAt = createdAt;
        this.userRole = userRole;
    }
}