package com.example.Vault.dto;


import com.fasterxml.jackson.databind.JsonNode;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UpdateVaultItemRequest {
    private String itemTitle;
    private Long categoryId;
    private JsonNode itemData; // Objet JSON flexible selon le type
}