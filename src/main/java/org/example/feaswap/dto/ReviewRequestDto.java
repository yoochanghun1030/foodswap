package org.example.feaswap.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReviewRequestDto {
    private Integer exchangeId;
    private Integer reviewerId;
    private Integer rating;
    private String comment;
}
