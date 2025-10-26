package com.example.Vault.repository;

import com.example.Vault.model.UserOrg;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserOrgRepository extends JpaRepository<UserOrg, Long> {

    // Vérifier si un utilisateur appartient à une organisation
    boolean existsByUserUserIdAndOrganisationOrgId(Long userId, Long orgId);

    // Trouver la relation entre un utilisateur et une organisation
    Optional<UserOrg> findByUserUserIdAndOrganisationOrgId(Long userId, Long orgId);

    // Trouver tous les membres d'une organisation
    List<UserOrg> findByOrganisationOrgId(Long orgId);

    // Trouver toutes les organisations d'un utilisateur
    List<UserOrg> findByUserUserId(Long userId);

    // Compter les membres d'une organisation
    @Query("SELECT COUNT(uo) FROM UserOrg uo WHERE uo.organisation.orgId = :orgId")
    Long countMembersByOrgId(@Param("orgId") Long orgId);

    Long countByUserUserId(Long userId);
}
