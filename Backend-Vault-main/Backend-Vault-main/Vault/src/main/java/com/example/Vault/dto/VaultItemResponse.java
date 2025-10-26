package com.example.Vault.dto;

import com.example.Vault.model.VaultItem;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class VaultItemResponse {
    private Long itemId;
    private String itemTitle;
    private VaultItem.ItemType itemType;
    private Long categoryId;
    private String categoryName;
    private Long userId;
    private String userName;
    private Long organisationId;
    private String organisationName;
    private String createdAt;
    private String updatedAt;
    // Note: itemData n'est jamais exposé dans les réponses normales pour sécurité

    public VaultItemResponse(VaultItem item) {
        this.itemId = item.getItemId();
        this.itemTitle = item.getItemTitle();
        this.itemType = item.getItemType();
        this.categoryId = item.getCategory().getCatId();
        this.categoryName = item.getCategory().getCatName();
        this.userId = item.getUser().getUserId();
        this.userName = item.getUser().getUserName();

        if (item.getOrganisation() != null) {
            this.organisationId = item.getOrganisation().getOrgId();
            this.organisationName = item.getOrganisation().getOrgName();
        }

        this.createdAt = item.getCreatedAt().toString();
        this.updatedAt = item.getUpdatedAt().toString();
    }
}