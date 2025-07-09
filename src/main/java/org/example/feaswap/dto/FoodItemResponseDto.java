package org.example.feaswap.dto;

import org.example.feaswap.entity.FoodItem;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Builder
public class FoodItemResponseDto {
    private Integer fooditemId;
    private Integer ownerId;
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
    private LocalDateTime createdAt;
    private Boolean isCompleted;

    public static FoodItemResponseDto fromEntity(FoodItem item) {
        return FoodItemResponseDto.builder()
                .fooditemId   (item.getFoodItemId())
                .ownerId      (item.getOwner().getUserId())
                .title        (item.getTitle())
                .category     (item.getCategory())
                .quantity     (item.getQuantity())
                .unit         (item.getUnit())
                .availableFrom(item.getAvailableFrom())
                .availableUntil(item.getAvailableUntil())
                .nutritionFacts(item.getNutritionFacts())
                .imageUrl     (item.getImageUrl())
                .latitude     (Double.valueOf(item.getLatitude()))
                .longitude    (Double.valueOf(item.getLongitude()))
                .createdAt    (item.getCreatedAt())
                .isCompleted(item.getIsCompleted())
                .build();
    }

}
