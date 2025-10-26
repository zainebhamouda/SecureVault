package com.example.Vault.service;
import java.util.Optional;
import com.example.Vault.model.User;
import com.example.Vault.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(User user) {
        if (userRepository.existsByUserEmail(user.getUserEmail())) {
            throw new RuntimeException("Email already exists");
        }


        // Encoder le mot de passe
        user.setUserPassword(passwordEncoder.encode(user.getUserPassword()));
        return userRepository.save(user);
    }

    public User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(Long id, User userDetails) {
        User user = getUser(id);

        if (userDetails.getUserName() != null) {
            user.setUserName(userDetails.getUserName());
        }
        if (userDetails.getUserEmail() != null) {
            if (!user.getUserEmail().equals(userDetails.getUserEmail()) &&
                    userRepository.existsByUserEmail(userDetails.getUserEmail())) {
                throw new RuntimeException("Email already exists");
            }
            user.setUserEmail(userDetails.getUserEmail());
        }
        if (userDetails.getUserPassword() != null) {
            user.setUserPassword(passwordEncoder.encode(userDetails.getUserPassword()));
        }

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }
    public User findByEmail(String email) {
        Optional<User> userOpt = userRepository.findByUserEmail(email);
        if (userOpt.isPresent()) {
            return userOpt.get();
        } else {
            throw new RuntimeException("Utilisateur non trouvé avec l'email : " + email);
        }
    }
    public User updateUser(User user) {
        return userRepository.save(user);
    }

}