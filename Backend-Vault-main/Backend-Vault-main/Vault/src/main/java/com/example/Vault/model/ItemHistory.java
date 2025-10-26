package com.example.Vault.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "item_history")
@Getter @Setter
public class ItemHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long historyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private VaultItem vaultItem;

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", nullable = false)
    private ActionType actionType;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Enum pour les types d'actions
    public enum ActionType {
        CREATE,
        UPDATE,
        DELETE,
        READ
    }

    // Constructeurs
    public ItemHistory() {}

    public ItemHistory(User user, VaultItem vaultItem, ActionType actionType) {
        this.user = user;
        this.vaultItem = vaultItem;
        this.actionType = actionType;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}