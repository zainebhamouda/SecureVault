package com.example.Vault.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "organisations")
@Getter @Setter
public class Organisation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orgId;

    @Column(nullable = false)
    private String orgName;

    @Column(nullable = false)
    private Integer membersCount = 0;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Relations
    @OneToMany(mappedBy = "organisation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<UserOrg> userOrgs;

    @OneToMany(mappedBy = "organisation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<VaultItem> vaultItems;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.orgName != null) {
            this.orgName = this.orgName.trim();
        }
    }

    // Méthodes utilitaires
    public void incrementMembersCount() {
        this.membersCount++;
    }

    public void decrementMembersCount() {
        if (this.membersCount > 0) {
            this.membersCount--;
        }
    }
}