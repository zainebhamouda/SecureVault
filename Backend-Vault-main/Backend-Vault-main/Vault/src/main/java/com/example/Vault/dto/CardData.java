package com.example.Vault.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CardData {
    private String cardholderName;
    private String cardNumber;
    private String expirationDate;
    private String CVV ;
    private String notes ;

}