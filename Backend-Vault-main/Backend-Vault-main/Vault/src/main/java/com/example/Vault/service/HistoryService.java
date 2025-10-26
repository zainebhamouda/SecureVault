package com.example.Vault.service;

import com.example.Vault.model.ItemHistory;
import com.example.Vault.model.VaultItem;
import com.example.Vault.model.UserOrg;
import com.example.Vault.repository.ItemHistoryRepository;
import com.example.Vault.repository.VaultItemRepository;
import com.example.Vault.repository.UserOrgRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class HistoryService {

    private final ItemHistoryRepository historyRepository;
    private final VaultItemRepository vaultItemRepository;
    private final UserOrgRepository userOrgRepository;

    public HistoryService(ItemHistoryRepository historyRepository,
                          VaultItemRepository vaultItemRepository,
                          UserOrgRepository userOrgRepository) {
        this.historyRepository = historyRepository;
        this.vaultItemRepository = vaultItemRepository;
        this.userOrgRepository = userOrgRepository;
    }

    public List<ItemHistory> getItemHistoryByDateRange(Long itemId, Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        // Vérifier que l'utilisateur a accès à cet item
        VaultItem item = vaultItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Vault item not found"));

        // Vérification des droits d'accès
        if (item.getOrganisation() != null) {
            // Vérifier si l'utilisateur fait partie de l'organisation
            if (!userOrgRepository.existsByUserUserIdAndOrganisationOrgId(userId, item.getOrganisation().getOrgId())) {
                throw new RuntimeException("Access denied: You are not a member of this organisation");
            }
        } else {
            // Item personnel - vérifier que c'est le propriétaire
            if (!item.getUser().getUserId().equals(userId)) {
                throw new RuntimeException("Access denied: This is not your item");
            }
        }

        // Récupérer l'historique avec filtrage par date
        if (startDate != null && endDate != null) {
            return historyRepository.findByVaultItemItemIdAndCreatedAtBetweenOrderByCreatedAtDesc(itemId, startDate, endDate);
        } else if (startDate != null) {
            return historyRepository.findByVaultItemItemIdAndCreatedAtAfterOrderByCreatedAtDesc(itemId, startDate);
        } else if (endDate != null) {
            return historyRepository.findByVaultItemItemIdAndCreatedAtBeforeOrderByCreatedAtDesc(itemId, endDate);
        } else {
            return historyRepository.findByVaultItemItemIdOrderByCreatedAtDesc(itemId);
        }
    }
}