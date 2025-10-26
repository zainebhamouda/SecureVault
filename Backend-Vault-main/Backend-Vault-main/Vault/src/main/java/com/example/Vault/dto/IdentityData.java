package com.example.Vault.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class IdentityData {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String country;
    private LocalDate dateOfBirth;
    private String postalCode;
    private String passportNumber;
    private String driverLicense;
    private String gender;
    private String notes;
}