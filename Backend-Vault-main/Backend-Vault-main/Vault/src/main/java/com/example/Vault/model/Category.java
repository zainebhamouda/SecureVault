package com.example.Vault.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

@Entity
@Table(name = "categories")
@Getter @Setter
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long catId;

    @Column(nullable = false, unique = true)
    private String catName;

    // Relations
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<VaultItem> vaultItems;

    // Constructeurs
    public Category() {}

    public Category(String catName) {
        this.catName = catName;
    }

    @PrePersist
    @PreUpdate
    public void processName() {
        if (this.catName != null) {
            this.catName = this.catName.trim();
        }
    }
}