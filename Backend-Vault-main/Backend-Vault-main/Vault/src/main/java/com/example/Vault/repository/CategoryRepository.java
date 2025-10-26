package com.example.Vault.repository;

import com.example.Vault.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByCatName(String catName);//shows the details of that catName
    boolean existsByCatName(String catName);// tells us if a catName exist or not
}
