package com.example.Vault.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;


@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class NoteData {
    private String categoryy;
    private String content;
    private String tags;
}
