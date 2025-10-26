package com.example.Vault.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.*;
import org.springframework.web.client.HttpStatusCodeException;

@CrossOrigin(origins = "http://localhost:4200") // Autoriser Angular
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Value("${openai.api.key}")
    private String apiKey; // Clé OpenAI dans application.properties

    @PostMapping
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> payload) {
        String message = payload.get("question"); // clé alignée avec Angular

        // === Ajoute ces lignes pour debug ===
        System.out.println("Question reçue : " + message);
        if (apiKey != null && !apiKey.isEmpty()) {
            System.out.println("Clé OpenAI : " + apiKey.substring(0, 8) + "...");
        } else {
            System.out.println("Clé OpenAI absente ou vide !");
        }
        // === Fin debug ===

        if (message == null || message.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("reply", "Message vide."));
        }

        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://api.openai.com/v1/chat/completions";

            Map<String, Object> body = new HashMap<>();
            body.put("model", "gpt-4o-mini");
            body.put("temperature", 0.2);
            body.put("messages", List.of(
                    Map.of("role", "system", "content", "You are a helpful assistant for the SecureVault app."),
                    Map.of("role", "user", "content", message)
            ));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, request, Map.class);

            List choices = (List) response.getBody().get("choices");
            if (choices == null || choices.isEmpty()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("reply", "Aucune réponse d'OpenAI."));
            }

            Map choice0 = (Map) choices.get(0);
            Map messageMap = (Map) choice0.get("message");
            String reply = (String) messageMap.get("content");

            return ResponseEntity.ok(Map.of("reply", reply));

        } catch (HttpStatusCodeException e) {
            HttpStatusCode statusCode = e.getStatusCode();
            if (statusCode.value() == 429) { // TOO_MANY_REQUESTS
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                        .body(Map.of("reply", "Quota OpenAI dépassé. Veuillez vérifier votre plan."));
            } else if (statusCode.value() == 403) { // FORBIDDEN
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("reply", "Clé OpenAI invalide ou projet non autorisé."));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("reply", "Erreur OpenAI : " + e.getResponseBodyAsString()));
            }
        }

    }

}
