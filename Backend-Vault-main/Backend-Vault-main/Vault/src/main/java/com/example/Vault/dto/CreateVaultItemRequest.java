package com.example.Vault.dto;

import com.example.Vault.model.VaultItem;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.databind.JsonNode;

@Getter @Setter
public class
CreateVaultItemRequest {
    private String itemTitle;
    private VaultItem.ItemType itemType;
    private Long categoryId;
    private Long organisationId; // Optionnel
    private JsonNode itemData; // Objet JSON flexible selon le type
}