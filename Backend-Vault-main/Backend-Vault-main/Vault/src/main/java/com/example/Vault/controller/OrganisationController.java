package com.example.Vault.controller;

import com.example.Vault.dto.AddMemberRequest;
import com.example.Vault.dto.CreateOrganisationRequest;
import com.example.Vault.dto.MemberResponse;
import com.example.Vault.dto.OrganisationResponse;
import com.example.Vault.model.Organisation;
import com.example.Vault.model.UserOrg;
import com.example.Vault.repository.UserOrgRepository;
import com.example.Vault.service.OrganisationService;
import com.example.Vault.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/organisations")
public class OrganisationController {

    private final OrganisationService organisationService;
    private final UserService userService;
    private final UserOrgRepository userOrgRepository;

    public OrganisationController(OrganisationService organisationService, UserService userService, UserOrgRepository userOrgRepository) {
        this.organisationService = organisationService;
        this.userService = userService;
        this.userOrgRepository = userOrgRepository;
    }

    @PostMapping
    public ResponseEntity<?> createOrganisation(@RequestBody CreateOrganisationRequest request,
                                                Authentication authentication) {
        try {
            Long userId = userService.getUserByEmail(authentication.getName()).getUserId();
            Organisation organisation = organisationService.createOrganisation(request.getOrgName(), userId);
            return ResponseEntity.ok(organisation);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping
    public ResponseEntity<List<OrganisationResponse>> getUserOrganisations(Authentication authentication) {
        Long userId = userService.getUserByEmail(authentication.getName()).getUserId();
        List<OrganisationResponse> organisations = organisationService.getUserOrganisations(userId);
        return ResponseEntity.ok(organisations);
    }

    @GetMapping("/{orgId}")
    public ResponseEntity<?> getOrganisation(@PathVariable Long orgId, Authentication authentication) {
        try {
            Long userId = userService.getUserByEmail(authentication.getName()).getUserId();
            Organisation organisation = organisationService.getOrganisation(orgId, userId);
            return ResponseEntity.ok(organisation);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/{orgId}/members")
    public ResponseEntity<?> addMember(@PathVariable Long orgId,
                                       @RequestBody AddMemberRequest request,
                                       Authentication authentication) {
        try {
            Long requesterId = userService.getUserByEmail(authentication.getName()).getUserId();
            UserOrg.UserRole role = UserOrg.UserRole.valueOf(request.getUserRole().toUpperCase());

            UserOrg userOrg = organisationService.addMember(orgId, request.getUserEmail(), role, requesterId);

            // Créer une réponse sécurisée sans proxies Hibernate
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Member added successfully");
            response.put("userId", userOrg.getUser().getUserId());
            response.put("userName", userOrg.getUser().getUserName());
            response.put("userEmail", userOrg.getUser().getUserEmail());
            response.put("userRole", userOrg.getUserRole());
            response.put("organisationId", userOrg.getOrganisation().getOrgId());
            response.put("organisationName", userOrg.getOrganisation().getOrgName());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/{orgId}/members")
    public ResponseEntity<?> getMembers(@PathVariable Long orgId, Authentication authentication) {
        try {
            Long userId = userService.getUserByEmail(authentication.getName()).getUserId();
            List<MemberResponse> members = organisationService.getOrganisationMembers(orgId, userId);
            return ResponseEntity.ok(members);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{orgId}/members/{memberUserId}")
    public ResponseEntity<?> removeMember(@PathVariable Long orgId,
                                          @PathVariable Long memberUserId,
                                          Authentication authentication) {
        try {
            Long requesterId = userService.getUserByEmail(authentication.getName()).getUserId();
            organisationService.removeMember(orgId, memberUserId, requesterId);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Member removed successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{orgId}")
    public ResponseEntity<?> deleteOrganisation(@PathVariable Long orgId, Authentication authentication) {
        try {
            Long userId = userService.getUserByEmail(authentication.getName()).getUserId();
            organisationService.deleteOrganisation(orgId, userId);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Organisation deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getUserOrganisationsCount(Authentication authentication) {
        Long userId = userService.getUserByEmail(authentication.getName()).getUserId();
        Long organisationsCount = userOrgRepository.countByUserUserId(userId);

        Map<String, Long> response = new HashMap<>();
        response.put("totalOrganisations", organisationsCount);

        return ResponseEntity.ok(response);
    }
}