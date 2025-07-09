package org.example.feaswap.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserRequestDto {
    private String username;
    private String email;
    private String password;
    private String phone;
    private String location;
    private Double latitude;
    private Double longitude;
}
