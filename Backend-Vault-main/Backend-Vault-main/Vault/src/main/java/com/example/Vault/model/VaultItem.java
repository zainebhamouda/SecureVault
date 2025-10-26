package com.example.Vault.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "vault_items")
@Getter @Setter
public class VaultItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cat_id", nullable = false)
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_type", nullable = false)
    private ItemType itemType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_id")
    private Organisation organisation;

    @Column(nullable = false)
    private String itemTitle;

    @JsonIgnore // Données sensibles stockées en JSON
    @Column(name = "item_data", columnDefinition = "TEXT")
    private String itemData; // JSON string contenant les données spécifiques au type

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Relations
    @OneToMany(mappedBy = "vaultItem", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ItemHistory> itemHistories;

    // Enum pour les types d'éléments
    public enum ItemType {
        LOGIN,
        CARD,
        NOTE,
        IDENTITY
    }

    // Constructeurs
    public VaultItem() {}

    public VaultItem(String itemTitle, ItemType itemType, Category category, User user) {
        this.itemTitle = itemTitle;
        this.itemType = itemType;
        this.category = category;
        this.user = user;
    }

    // Méthodes utilitaires pour manipuler itemData
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public <T> void setItemDataObject(T dataObject) {
        try {
            this.itemData = objectMapper.writeValueAsString(dataObject);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error serializing item data", e);
        }
    }

    public <T> T getItemDataObject(Class<T> clazz) {
        if (this.itemData == null || this.itemData.trim().isEmpty()) {
            return null;
        }
        try {
            return objectMapper.readValue(this.itemData, clazz);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error deserializing item data", e);
        }
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.itemTitle != null) {
            this.itemTitle = this.itemTitle.trim();
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
        if (this.itemTitle != null) {
            this.itemTitle = this.itemTitle.trim();
        }
    }
}