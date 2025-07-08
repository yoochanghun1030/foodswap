package org.example.feaswap.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class RegisterRequestDto {
    private String email;
    private String username;
    private String password;
}
