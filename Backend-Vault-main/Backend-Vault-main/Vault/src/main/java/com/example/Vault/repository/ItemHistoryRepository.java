package com.example.Vault.repository;

import com.example.Vault.model.ItemHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ItemHistoryRepository extends JpaRepository<ItemHistory, Long> {

    // Historique d'un item spécifique
    List<ItemHistory> findByVaultItemItemIdOrderByCreatedAtDesc(Long itemId);

    // Historique d'un item entre deux dates
    List<ItemHistory> findByVaultItemItemIdAndCreatedAtBetweenOrderByCreatedAtDesc(
            Long itemId, LocalDateTime startDate, LocalDateTime endDate);

    // Historique d'un item après une date
    List<ItemHistory> findByVaultItemItemIdAndCreatedAtAfterOrderByCreatedAtDesc(
            Long itemId, LocalDateTime startDate);

    // Historique d'un item avant une date
    List<ItemHistory> findByVaultItemItemIdAndCreatedAtBeforeOrderByCreatedAtDesc(
            Long itemId, LocalDateTime endDate);
}