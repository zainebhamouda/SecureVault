package com.example.Vault.dto;

import com.example.Vault.model.ItemHistory;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter @Setter
public class HistoryResponse {
    private Long historyId;
    private String actionType;
    private LocalDate date;
    private String userName;
    private String itemTitle;
    private Long itemId;
    private String organisationName;

    public HistoryResponse(ItemHistory history) {
        this.historyId = history.getHistoryId();
        this.actionType = history.getActionType().toString();
        this.date = history.getCreatedAt().toLocalDate();
        this.userName = history.getUser().getUserName();

        if (history.getVaultItem() != null) {
            this.itemTitle = history.getVaultItem().getItemTitle();
            this.itemId = history.getVaultItem().getItemId();

            // Ajouter le nom de l'organisation si l'item appartient à une organisation
            if (history.getVaultItem().getOrganisation() != null) {
                this.organisationName = history.getVaultItem().getOrganisation().getOrgName();
            } else {
                this.organisationName = "---"; // Ou null
            }
        }
    }
}