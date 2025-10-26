package com.example.Vault.repository;

import com.example.Vault.model.VaultItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VaultItemRepository extends JpaRepository<VaultItem, Long> {

    // Trouver les items personnels d'un utilisateur (sans organisation)
    List<VaultItem> findByUserUserIdAndOrganisationIsNull(Long userId);

    // Trouver les items d'une organisation
    List<VaultItem> findByOrganisationOrgId(Long orgId);

    // Trouver tous les items d'un utilisateur (personnels + organisations)
    List<VaultItem> findByUserUserId(Long userId);

    // Recherche par titre
    List<VaultItem> findByUserUserIdAndItemTitleContainingIgnoreCase(Long userId, String title);

    // Filtrer par type d'item
    List<VaultItem> findByUserUserIdAndItemType(Long userId, VaultItem.ItemType itemType);

    // Filtrer par catégorie
    List<VaultItem> findByUserUserIdAndCategoryCatId(Long userId, Long categoryId);

    // Recherche dans une organisation
    @Query("SELECT v FROM VaultItem v WHERE v.organisation.orgId = :orgId AND v.itemTitle LIKE %:title%")
    List<VaultItem> findByOrganisationOrgIdAndItemTitleContaining(@Param("orgId") Long orgId, @Param("title") String title);

    // Compter les items d'un utilisateur
    Long countByUserUserId(Long userId);

    // Compter les items d'une organisation
    Long countByOrganisationOrgId(Long orgId);

    // Trouver les items récents d'un utilisateur
    @Query("SELECT v FROM VaultItem v WHERE v.user.userId = :userId ORDER BY v.updatedAt DESC")
    List<VaultItem> findRecentByUserId(@Param("userId") Long userId);
}