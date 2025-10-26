package com.example.Vault.controller;

import com.example.Vault.dto.HistoryResponse;
import com.example.Vault.model.ItemHistory;
import com.example.Vault.service.HistoryService;
import com.example.Vault.service.UserService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/history")
public class HistoryController {

    private final HistoryService historyService;
    private final UserService userService;

    public HistoryController(HistoryService historyService, UserService userService) {
        this.historyService = historyService;
        this.userService = userService;
    }

    @GetMapping("/item/{itemId}")
    public ResponseEntity<?> getItemHistory(@PathVariable Long itemId,
                                            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
                                            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
                                            Authentication authentication) {
        try {
            Long userId = userService.getUserByEmail(authentication.getName()).getUserId();
            List<ItemHistory> history = historyService.getItemHistoryByDateRange(itemId, userId, startDate, endDate);

            List<HistoryResponse> response = history.stream()
                    .map(HistoryResponse::new)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}