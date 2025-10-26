package com.example.Vault.service;

import com.example.Vault.model.VaultItem;
import com.example.Vault.model.User;
import com.example.Vault.model.Organisation;
import com.example.Vault.model.Category;
import com.example.Vault.model.UserOrg;
import com.example.Vault.model.ItemHistory;
import com.example.Vault.repository.VaultItemRepository;
import com.example.Vault.repository.UserRepository;
import com.example.Vault.repository.OrganisationRepository;
import com.example.Vault.repository.CategoryRepository;
import com.example.Vault.repository.UserOrgRepository;
import com.example.Vault.repository.ItemHistoryRepository;
import com.example.Vault.dto.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class VaultItemService {

    private final VaultItemRepository vaultItemRepository;
    private final UserRepository userRepository;
    private final OrganisationRepository organisationRepository;
    private final CategoryRepository categoryRepository;
    private final UserOrgRepository userOrgRepository;
    private final ItemHistoryRepository itemHistoryRepository;
    private final ObjectMapper objectMapper;

    public VaultItemService(VaultItemRepository vaultItemRepository,
                            UserRepository userRepository,
                            OrganisationRepository organisationRepository,
                            CategoryRepository categoryRepository,
                            UserOrgRepository userOrgRepository,
                            ItemHistoryRepository itemHistoryRepository,
                            ObjectMapper objectMapper) {
        this.vaultItemRepository = vaultItemRepository;
        this.userRepository = userRepository;
        this.organisationRepository = organisationRepository;
        this.categoryRepository = categoryRepository;
        this.userOrgRepository = userOrgRepository;
        this.itemHistoryRepository = itemHistoryRepository;
        this.objectMapper = objectMapper;
    }

    public VaultItem createVaultItem(String itemTitle, VaultItem.ItemType itemType,
                                     Long categoryId, JsonNode itemData,
                                     Long userId, Long orgId) {
        // Vérifier que l'utilisateur existe
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Vérifier que la catégorie existe
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        VaultItem vaultItem = new VaultItem();
        vaultItem.setItemTitle(itemTitle);
        vaultItem.setItemType(itemType);
        vaultItem.setUser(user);
        vaultItem.setCategory(category);

        // Traiter itemData selon le type
        processItemData(vaultItem, itemType, itemData);

        // Si l'item appartient à une organisation
        if (orgId != null) {
            if (!userOrgRepository.existsByUserUserIdAndOrganisationOrgId(userId, orgId)) {
                throw new RuntimeException("Access denied: You are not a member of this organisation");
            }

            Organisation organisation = organisationRepository.findById(orgId)
                    .orElseThrow(() -> new RuntimeException("Organisation not found"));
            vaultItem.setOrganisation(organisation);
        }

        VaultItem savedItem = vaultItemRepository.save(vaultItem);

        // Créer un historique
        ItemHistory history = new ItemHistory(user, savedItem, ItemHistory.ActionType.CREATE);
        itemHistoryRepository.save(history);

        return savedItem;
    }

    private void processItemData(VaultItem vaultItem, VaultItem.ItemType itemType, JsonNode itemData) {
        if (itemData == null) return;

        try {
            switch (itemType) {
                case LOGIN:
                    LoginData loginData = objectMapper.treeToValue(itemData, LoginData.class);
                    vaultItem.setItemDataObject(loginData);
                    break;
                case CARD:
                    CardData cardData = objectMapper.treeToValue(itemData, CardData.class);
                    vaultItem.setItemDataObject(cardData);
                    break;
                case NOTE:
                    NoteData noteData = objectMapper.treeToValue(itemData, NoteData.class);
                    vaultItem.setItemDataObject(noteData);
                    break;
                case IDENTITY:
                    IdentityData identityData = objectMapper.treeToValue(itemData, IdentityData.class);
                    vaultItem.setItemDataObject(identityData);
                    break;
                default:
                    throw new RuntimeException("Unsupported item type: " + itemType);
            }
        } catch (Exception e) {
            throw new RuntimeException("Invalid item data format for type: " + itemType, e);
        }
    }

    public List<VaultItem> getUserVaultItems(Long userId) {
        return vaultItemRepository.findByUserUserIdAndOrganisationIsNull(userId);
    }

    public List<VaultItem> getOrganisationVaultItems(Long orgId, Long userId) {
        if (!userOrgRepository.existsByUserUserIdAndOrganisationOrgId(userId, orgId)) {
            throw new RuntimeException("Access denied: You are not a member of this organisation");
        }

        return vaultItemRepository.findByOrganisationOrgId(orgId);
    }

    public VaultItem getVaultItem(Long itemId, Long userId) {
        VaultItem item = vaultItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Vault item not found"));

        // Vérifier les droits d'accès
        if (item.getOrganisation() != null) {
            if (!userOrgRepository.existsByUserUserIdAndOrganisationOrgId(userId, item.getOrganisation().getOrgId())) {
                throw new RuntimeException("Access denied");
            }
        } else {
            if (!item.getUser().getUserId().equals(userId)) {
                throw new RuntimeException("Access denied");
            }
        }

        // Créer un historique de lecture
        User user = userRepository.findById(userId).orElseThrow();
        ItemHistory history = new ItemHistory(user, item, ItemHistory.ActionType.READ);
        itemHistoryRepository.save(history);

        return item;
    }

    public VaultItem updateVaultItem(Long itemId, String itemTitle, Long categoryId,
                                     JsonNode itemData, Long userId) {
        VaultItem item = getVaultItem(itemId, userId);

        // Mettre à jour les champs
        if (itemTitle != null) {
            item.setItemTitle(itemTitle);
        }
        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            item.setCategory(category);
        }
        if (itemData != null) {
            processItemData(item, item.getItemType(), itemData);
        }

        VaultItem updatedItem = vaultItemRepository.save(item);

        // Créer un historique
        User user = userRepository.findById(userId).orElseThrow();
        ItemHistory history = new ItemHistory(user, updatedItem, ItemHistory.ActionType.UPDATE);
        itemHistoryRepository.save(history);

        return updatedItem;
    }

    public void deleteVaultItem(Long itemId, Long userId) {
        VaultItem item = getVaultItem(itemId, userId);

        // Créer un historique avant suppression
        User user = userRepository.findById(userId).orElseThrow();
        ItemHistory history = new ItemHistory(user, item, ItemHistory.ActionType.DELETE);
        itemHistoryRepository.save(history);

        vaultItemRepository.delete(item);
    }

    public List<VaultItem> searchVaultItems(String query, Long userId) {
        return vaultItemRepository.findByUserUserIdAndItemTitleContainingIgnoreCase(userId, query);
    }

    public List<VaultItem> getVaultItemsByType(VaultItem.ItemType itemType, Long userId) {
        return vaultItemRepository.findByUserUserIdAndItemType(userId, itemType);
    }

    public List<VaultItem> getVaultItemsByCategory(Long categoryId, Long userId) {
        return vaultItemRepository.findByUserUserIdAndCategoryCatId(userId, categoryId);
    }
}