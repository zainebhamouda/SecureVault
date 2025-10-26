package com.example.Vault.repository;

import com.example.Vault.model.Organisation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrganisationRepository extends JpaRepository<Organisation, Long> {

    Optional<Organisation> findByOrgName(String orgName);
    boolean existsByOrgName(String orgName);

    // Trouver les organisations d'un utilisateur avec son rôle
    @Query("SELECT uo.organisation FROM UserOrg uo WHERE uo.user.userId = :userId")
    List<Organisation> findByUserId(@Param("userId") Long userId);

    // Trouver les organisations où l'utilisateur est propriétaire
    @Query("SELECT uo.organisation FROM UserOrg uo WHERE uo.user.userId = :userId AND uo.userRole = 'OWNER'")
    List<Organisation> findByUserIdAndOwnerRole(@Param("userId") Long userId);
}