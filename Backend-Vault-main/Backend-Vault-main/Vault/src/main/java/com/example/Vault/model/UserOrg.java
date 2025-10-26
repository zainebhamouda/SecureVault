package com.example.Vault.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "user_org")
@Getter @Setter
public class UserOrg {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_id", nullable = false)
    private Organisation organisation;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_role", nullable = false)
    private UserRole userRole;

    // Enum pour les rôles utilisateur
    public enum UserRole {
        OWNER,
        MEMBER
    }

    // Constructeurs
    public UserOrg() {}

    public UserOrg(User user, Organisation organisation, UserRole userRole) {
        this.user = user;
        this.organisation = organisation;
        this.userRole = userRole;
    }
}