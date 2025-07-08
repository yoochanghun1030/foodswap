package org.example.feaswap.dto;

import org.example.feaswap.entity.Review;
import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReviewResponseDto {
    private Integer reviewId;
    private Integer exchangeId;
    private Integer reviewerId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;

    public static ReviewResponseDto fromEntity(Review r) {
        return ReviewResponseDto.builder()
                .reviewId(r.getReviewId())
                .exchangeId(r.getExchange().getExchangeId())
                .reviewerId(r.getReviewer().getUserId())
                .rating(r.getRating())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
