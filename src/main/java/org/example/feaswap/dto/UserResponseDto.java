package org.example.feaswap.dto;

import org.example.feaswap.entity.User;
import org.example.feaswap.entity.Role;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserResponseDto {
    private Integer userId;
    private String username;
    private String email;
    private String phone;
    private Role role;
    private String location;
    private Double latitude;
    private Double longitude;
    private LocalDateTime createdAt;

    public static UserResponseDto fromEntity(User u) {
        return UserResponseDto.builder()
                .userId(u.getUserId())
                .username(u.getUsername())
                .email(u.getEmail())
                .phone(u.getPhone())
                .role(u.getRole())
                .location(u.getLocation())
                .latitude(u.getLatitude())
                .longitude(u.getLongitude())
                .createdAt(u.getCreatedAt())
                .build();
    }
}
