package org.example.feaswap.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class JwtResponseDto {
    private String token;
    private Integer userId;
    private String username;
    private String email;
    private String role;
}
