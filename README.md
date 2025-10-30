# 🔐 SecureVault

SecureVault est une **plateforme web sécurisée** qui permet aux utilisateurs de gérer, organiser et partager leurs mots de passe et données sensibles de manière simple et fiable.  
Elle intègre également un **chatbot intelligent alimenté par l’IA (OpenAI)**, capable d’accompagner les utilisateurs et d’améliorer leur expérience en temps réel.

---

##  Fonctionnalités principales

###  Gestion des coffres et identifiants
- Créer, organiser et rechercher des coffres (Vaults) et des identifiants.
- Partager de manière sécurisée les données avec d’autres utilisateurs.

###  Sécurité
- Authentification sécurisée avec **JWT**.
- Chiffrement des mots de passe avec **bcrypt**.
- Gestion des rôles et permissions (Users / Admins).

###  Gestion des organisations
- Créer une organisation.
- Ajouter et gérer des membres.
- Gérer les accès par rôle.

###  Chatbot IA intégré
- Assistance en temps réel.
- Réponses automatiques aux questions des utilisateurs.
- Aide guidée pour l’utilisation de la plateforme.


##  Architecture du projet
```plaintext
SecureVault/
├── backend/
│   ├── src/main/java/com/securevault/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── services/
│   │   └── SecureVaultApplication.java
│   └── src/main/resources/
│       └── application.properties
│
├── frontend/
│   ├── src/app/
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── signUp/
│   │   ├── services/
│   │   └── welcome/
│   └── angular.json
│
└── README.md

### 🧩 1️⃣ Backend (Spring Boot)
```bash
cd Backend-Vault-main
./mvnw clean install   # ou mvn clean install si Maven est installé
./mvnw spring-boot:run

### Frontend (Angular)
cd vault-projet
npm install
ng serve -o

