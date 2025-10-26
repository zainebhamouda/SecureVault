package com.example.Vault.controller;

import com.example.Vault.dto.CreateVaultItemRequest;
import com.example.Vault.dto.UpdateVaultItemRequest;
import com.example.Vault.dto.VaultItemResponse;
import com.example.Vault.dto.VaultItemWithDataResponse;
import com.example.Vault.model.VaultItem;
import com.example.Vault.repository.VaultItemRepository;
import com.example.Vault.service.VaultItemService;
import com.example.Vault.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/vault-items")
public class VaultItemController {

    private final VaultItemService vaultItemService;
    private final UserService userService;
    private final VaultItemRepository vaultItemRepository;

    public VaultItemController(VaultItemService vaultItemService,
                               UserService userService,
                               VaultItemRepository vaultItemRepository) {
        this.vaultItemService = vaultItemService;
        this.userService = userService;
        this.vaultItemRepository = vaultItemRepository;
    }

    @PostMapping
    public ResponseEntity<?> createVaultItem(@RequestBody CreateVaultItemRequest request,
                                             Authentication authentication) {
        try {
            Long userId = userService.getUserByEmail(authentication.getName()).getUserId();

            VaultItem createdItem = vaultItemService.createVaultItem(
                    request.getItemTitle(),
                    request.getItemType(),
                    request.getCategoryId(),
                    request.getItemData(),
                    userId,
                    request.getOrganisationId()
            );

            return ResponseEntity.ok(new VaultItemResponse(createdItem));
        } catch (Exception e) {
            return buildErrorResponse(e);
        }
    }

    @GetMapping("/personal")
    public ResponseEntity<List<VaultItemResponse>> getPersonalVaultItems(Authentication authentication) {
        Long userId = userService.getUserByEmail(authentication.getName()).getUserId();
        List<VaultItem> items = vaultItemService.getUserVaultItems(userId);

        List<VaultItemResponse> response = items.stream()
                .map(VaultItemResponse::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/organisation/{orgId}")
    public ResponseEntity<?> getOrganisationVaultItems(@PathVariable Long orgId,
                                                       Authentication authentication) {
        try {
            Long userId = userService.getUserByEmail(authentication.getName()).getUserId();
            List<VaultItem> items = vaultItemService.getOrganisationVaultItems(orgId, userId);

            List<VaultItemResponse> response = items.stream()
                    .map(VaultItemResponse::new)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return buildErrorResponse(e);
        }
    }

    @GetMapping("/{itemId}")
    public ResponseEntity<?> getVaultItem(@PathVariable Long itemId,
                                          Authentication authentication) {
        try {
            Long userId = userService.getUserByEmail(authentication.getName()).getUserId();
            VaultItem item = vaultItemService.getVaultItem(itemId, userId);

            return ResponseEntity.ok(new VaultItemResponse(item));
        } catch (Exception e) {
            return buildErrorResponse(e);
        }
    }

    @GetMapping("/{itemId}/data")
    public ResponseEntity<?> getVaultItemData(@PathVariable Long itemId,
                                              Authentication authentication) {
        try {
            Long userId = userService.getUserByEmail(authentication.getName()).getUserId();
            VaultItem item = vaultItemService.getVaultItem(itemId, userId);

            return ResponseEntity.ok(new VaultItemWithDataResponse(item));
        } catch (Exception e) {
            return buildErrorResponse(e);
        }
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<?> updateVaultItem(@PathVariable Long itemId,
                                             @RequestBody UpdateVaultItemRequest request,
                                             Authentication authentication) {
        try {
            Long userId = userService.getUserByEmail(authentication.getName()).getUserId();

            VaultItem updatedItem = vaultItemService.updateVaultItem(
                    itemId,
                    request.getItemTitle(),
                    request.getCategoryId(),
                    request.getItemData(),
                    userId
            );

            return ResponseEntity.ok(new VaultItemResponse(updatedItem));
        } catch (Exception e) {
            return buildErrorResponse(e);
        }
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<?> deleteVaultItem(@PathVariable Long itemId,
                                             Authentication authentication) {
        try {
            Long userId = userService.getUserByEmail(authentication.getName()).getUserId();
            vaultItemService.deleteVaultItem(itemId, userId);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Vault item deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return buildErrorResponse(e);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<VaultItemResponse>> searchVaultItems(@RequestParam String query,
                                                                    Authentication authentication) {
        Long userId = userService.getUserByEmail(authentication.getName()).getUserId();
        List<VaultItem> items = vaultItemService.searchVaultItems(query, userId);

        List<VaultItemResponse> response = items.stream()
                .map(VaultItemResponse::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/filter/type/{itemType}")
    public ResponseEntity<List<VaultItemResponse>> getVaultItemsByType(@PathVariable VaultItem.ItemType itemType,
                                                                       Authentication authentication) {
        Long userId = userService.getUserByEmail(authentication.getName()).getUserId();
        List<VaultItem> items = vaultItemService.getVaultItemsByType(itemType, userId);

        List<VaultItemResponse> response = items.stream()
                .map(VaultItemResponse::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/filter/category/{categoryId}")
    public ResponseEntity<List<VaultItemResponse>> getVaultItemsByCategory(@PathVariable Long categoryId,
                                                                           Authentication authentication) {
        Long userId = userService.getUserByEmail(authentication.getName()).getUserId();
        List<VaultItem> items = vaultItemService.getVaultItemsByCategory(categoryId, userId);

        List<VaultItemResponse> response = items.stream()
                .map(VaultItemResponse::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getUserItemsCount(Authentication authentication) {
        Long userId = userService.getUserByEmail(authentication.getName()).getUserId();
        Long itemsCount = vaultItemRepository.countByUserUserId(userId);

        Map<String, Long> response = new HashMap<>();
        response.put("totalItems", itemsCount);

        return ResponseEntity.ok(response);
    }

    // Méthode utilitaire pour gérer les erreurs
    private ResponseEntity<Map<String, String>> buildErrorResponse(Exception e) {
        Map<String, String> error = new HashMap<>();
        error.put("error", e.getMessage());
        return ResponseEntity.badRequest().body(error);
    }
    @GetMapping("/all")
    public ResponseEntity<?> getAllVaultItems() {
        try {
            List<VaultItem> items = vaultItemRepository.findAll();
            List<VaultItemResponse> response = items.stream()
                    .map(VaultItemResponse::new)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return buildErrorResponse(e); // retourne Map<String,String>
        }
    }

}
