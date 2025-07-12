package org.example.feaswap.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "fooditems")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FoodItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fooditemid", nullable = false)
    private Integer foodItemId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ownerid", nullable = false)
    private User owner;

    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @Column(name = "category", length = 50, nullable = true)
    private String category;

    @Column(nullable = true)
    private Integer quantity;

    @Column(name = "unit", length = 20, nullable = true)
    private String unit;

    @Column(name = "availablefrom", nullable = true)
    private LocalDateTime availableFrom;

    @Column(name = "availableuntil", nullable = true)
    private LocalDateTime availableUntil;

    @Column(name = "imageurl", length = 255, nullable = true)
    private String imageUrl;

    @Column(name = "nutritionfacts", columnDefinition = "TEXT")
    private String nutritionFacts;

    @Column(name = "latitude", nullable = true)
    private Double latitude;

    @Column(name = "longitude", nullable = true)
    private Double longitude;

    @Column(name = "createdat", nullable = false,
            insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "iscompleted", nullable = false)
    private Boolean isCompleted;

}
