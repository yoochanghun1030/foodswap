package org.example.feaswap.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FoodItemRequestDto {
    private Integer fooditemId;
    private String title;
    private String category;
    private int quantity;
    private String unit;
    private LocalDateTime availableFrom;
    private LocalDateTime availableUntil;
    private String imageUrl;
    private String nutritionFacts;
    private Double latitude;
    private Double longitude;
}
