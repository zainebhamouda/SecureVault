🚀 Vault Backend – Spring Boot & PostgreSQL

Ce projet est la partie backend du gestionnaire Vault.
Il est développé avec Spring Boot, PostgreSQL et testé avec Postman.

📌 Prérequis

Avant de commencer, assurez-vous d’avoir installé :

Java 17+

Intellij Idea

Maven
 (si vous n’utilisez pas le wrapper ./mvnw)

PostgreSQL

Git

🔽 Installation et exécution en local

1️⃣ Cloner le projet
```
git clone https://github.com/<ton-username>/vault-backend.git
cd vault-backend
```

2️⃣ Créer la base de données PostgreSQL

Connectez-vous à PostgreSQL et exécutez :

```
CREATE DATABASE vaultdb;

CREATE USER vaultuser WITH ENCRYPTED PASSWORD 'vaultpassword';

GRANT ALL PRIVILEGES ON DATABASE vaultdb TO vaultuser;
```


👉 Vous pouvez modifier ces valeurs selon votre environnement.

3️⃣ Configurer l’application

Copiez le fichier application-example.properties vers application.properties :
```
cp src/main/resources/application-example.properties src/main/resources/application.properties
```

Puis mettez vos informations PostgreSQL (dans application.properties) :
```properties

spring.datasource.url=jdbc:postgresql://localhost:5432/vaultdb

spring.datasource.username=vaultuser

spring.datasource.password=vaultpassword

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

```
4️⃣ Lancer le projet

Avec le wrapper Maven (fourni dans le projet) :
```
./mvnw spring-boot:run
```

Ou si Maven est installé globalement :
```
mvn spring-boot:run
```



Le backend est alors disponible à l’adresse :
👉 http://localhost:8080

📮 Tester avec Postman

Importez la collection Postman (si disponible) ou utilisez directement les endpoints :

(https://ismail404-4973279.postman.co/workspace/ismail's-Workspace~826b6cb1-9419-4086-87ab-bae74f23ccf1/collection/47800819-0aa12476-441b-4642-b88b-0a9f930d52d3?action=share&source=copy-link&creator=47800819)
