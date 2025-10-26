package com.example.Vault.service;

import com.example.Vault.dto.OrganisationResponse;
import com.example.Vault.dto.MemberResponse;
import com.example.Vault.model.Organisation;
import com.example.Vault.model.User;
import com.example.Vault.model.UserOrg;
import com.example.Vault.repository.OrganisationRepository;
import com.example.Vault.repository.UserOrgRepository;
import com.example.Vault.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrganisationService {

    private final OrganisationRepository organisationRepository;
    private final UserOrgRepository userOrgRepository;
    private final UserRepository userRepository;

    public OrganisationService(OrganisationRepository organisationRepository,
                               UserOrgRepository userOrgRepository,
                               UserRepository userRepository) {
        this.organisationRepository = organisationRepository;
        this.userOrgRepository = userOrgRepository;
        this.userRepository = userRepository;
    }

    public Organisation createOrganisation(String orgName, Long creatorUserId) {
        // Vérifier si l'organisation existe déjà
        if (organisationRepository.existsByOrgName(orgName)) {
            throw new RuntimeException("Organisation name already exists");
        }

        // Vérifier que l'utilisateur existe
        User creator = userRepository.findById(creatorUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Créer l'organisation
        Organisation organisation = new Organisation();
        organisation.setOrgName(orgName);
        organisation.setMembersCount(1); // Le créateur est le premier membre
        Organisation savedOrg = organisationRepository.save(organisation);

        // Ajouter le créateur comme OWNER
        UserOrg userOrg = new UserOrg(creator, savedOrg, UserOrg.UserRole.OWNER);
        userOrgRepository.save(userOrg);

        return savedOrg;
    }

    public List<OrganisationResponse> getUserOrganisations(Long userId) {
        List<UserOrg> userOrgs = userOrgRepository.findByUserUserId(userId);

        return userOrgs.stream()
                .map(uo -> new OrganisationResponse(
                        uo.getOrganisation().getOrgId(),
                        uo.getOrganisation().getOrgName(),
                        uo.getOrganisation().getMembersCount(),
                        uo.getOrganisation().getCreatedAt(),
                        uo.getUserRole()
                ))
                .collect(Collectors.toList());
    }

    public Organisation getOrganisation(Long orgId, Long userId) {
        // Vérifier que l'utilisateur appartient à cette organisation
        if (!userOrgRepository.existsByUserUserIdAndOrganisationOrgId(userId, orgId)) {
            throw new RuntimeException("Access denied: You are not a member of this organisation");
        }

        return organisationRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organisation not found"));
    }

    public UserOrg addMember(Long orgId, String userEmail, UserOrg.UserRole role, Long requesterId) {
        // Vérifier que le demandeur est OWNER de l'organisation
        UserOrg requesterRelation = userOrgRepository.findByUserUserIdAndOrganisationOrgId(requesterId, orgId)
                .orElseThrow(() -> new RuntimeException("You are not a member of this organisation"));

        if (requesterRelation.getUserRole() != UserOrg.UserRole.OWNER) {
            throw new RuntimeException("Access denied: Only owners can add members");
        }

        // Trouver l'utilisateur à ajouter
        User userToAdd = userRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));

        // Vérifier qu'il n'est pas déjà membre
        if (userOrgRepository.existsByUserUserIdAndOrganisationOrgId(userToAdd.getUserId(), orgId)) {
            throw new RuntimeException("User is already a member of this organisation");
        }

        // Ajouter le membre
        Organisation organisation = organisationRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organisation not found"));

        UserOrg userOrg = new UserOrg(userToAdd, organisation, role);
        UserOrg savedUserOrg = userOrgRepository.save(userOrg);

        // Mettre à jour le compteur de membres
        organisation.incrementMembersCount();
        organisationRepository.save(organisation);

        return savedUserOrg;
    }

    public void removeMember(Long orgId, Long memberUserId, Long requesterId) {
        // Vérifier que le demandeur est OWNER
        UserOrg requesterRelation = userOrgRepository.findByUserUserIdAndOrganisationOrgId(requesterId, orgId)
                .orElseThrow(() -> new RuntimeException("You are not a member of this organisation"));

        if (requesterRelation.getUserRole() != UserOrg.UserRole.OWNER) {
            throw new RuntimeException("Access denied: Only owners can remove members");
        }

        // Empêcher de se retirer soi-même s'il est le seul owner
        if (requesterId.equals(memberUserId)) {
            long ownerCount = userOrgRepository.findByOrganisationOrgId(orgId).stream()
                    .mapToLong(uo -> uo.getUserRole() == UserOrg.UserRole.OWNER ? 1 : 0)
                    .sum();
            if (ownerCount <= 1) {
                throw new RuntimeException("Cannot remove the last owner of the organisation");
            }
        }

        // Supprimer le membre
        UserOrg memberRelation = userOrgRepository.findByUserUserIdAndOrganisationOrgId(memberUserId, orgId)
                .orElseThrow(() -> new RuntimeException("Member not found in this organisation"));

        userOrgRepository.delete(memberRelation);

        // Mettre à jour le compteur
        Organisation organisation = organisationRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organisation not found"));
        organisation.decrementMembersCount();
        organisationRepository.save(organisation);
    }

    public List<MemberResponse> getOrganisationMembers(Long orgId, Long userId) {
        // Vérifier que l'utilisateur appartient à cette organisation
        if (!userOrgRepository.existsByUserUserIdAndOrganisationOrgId(userId, orgId)) {
            throw new RuntimeException("Access denied: You are not a member of this organisation");
        }

        List<UserOrg> members = userOrgRepository.findByOrganisationOrgId(orgId);

        return members.stream()
                .map(uo -> new MemberResponse(
                        uo.getUser().getUserId(),
                        uo.getUser().getUserName(),
                        uo.getUser().getUserEmail(),
                        uo.getUserRole()
                ))
                .collect(Collectors.toList());
    }

    public void deleteOrganisation(Long orgId, Long userId) {
        // Vérifier que l'utilisateur est OWNER
        UserOrg userOrg = userOrgRepository.findByUserUserIdAndOrganisationOrgId(userId, orgId)
                .orElseThrow(() -> new RuntimeException("You are not a member of this organisation"));

        if (userOrg.getUserRole() != UserOrg.UserRole.OWNER) {
            throw new RuntimeException("Access denied: Only owners can delete organisations");
        }

        // Supprimer l'organisation (cascade supprimera automatiquement les relations)
        organisationRepository.deleteById(orgId);
    }
}