package com.example.Vault.controller;

import com.example.Vault.model.Category;
import com.example.Vault.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody Map<String, String> request) {
        try {
            String catName = request.get("catName");
            if (catName == null || catName.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Category name is required");
                return ResponseEntity.badRequest().body(error);
            }

            Category category = categoryService.createCategory(catName.trim());
            return ResponseEntity.ok(category);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{catId}")
    public ResponseEntity<?> getCategory(@PathVariable Long catId) {
        try {
            Category category = categoryService.getCategory(catId);
            return ResponseEntity.ok(category);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{catId}")
    public ResponseEntity<?> updateCategory(@PathVariable Long catId,
                                            @RequestBody Map<String, String> request) {
        try {
            String newName = request.get("catName");
            if (newName == null || newName.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Category name is required");
                return ResponseEntity.badRequest().body(error);
            }

            Category category = categoryService.updateCategory(catId, newName.trim());
            return ResponseEntity.ok(category);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{catId}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long catId) {
        try {
            categoryService.deleteCategory(catId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Category deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}