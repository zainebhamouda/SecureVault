package com.example.Vault.dto;

import com.example.Vault.model.VaultItem;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class VaultItemWithDataResponse {
	private Long itemId;
	private String itemTitle;
	private VaultItem.ItemType itemType;
	private Object itemData; // already-deserialized data (could be Map or DTO)

	public VaultItemWithDataResponse(VaultItem item) {
		this.itemId = item.getItemId();
		this.itemTitle = item.getItemTitle();
		this.itemType = item.getItemType();

		try {
			// Try to preserve raw JSON as String, or keep as parsed object if available via model helper
			this.itemData = item.getItemDataObject(Object.class);
		} catch (Exception ex) {
			// Fallback: raw JSON string
			this.itemData = item.getItemData();
		}
	}
}

