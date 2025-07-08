package org.example.feaswap.dto;


import org.example.feaswap.entity.ExchangeRequest;
import org.example.feaswap.entity.ExchangeStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ExchangeRequestResponseDto {
    private Integer exchangeId;
    private Integer requesterId;
    private Integer responderId;
    private Integer requestedItemId;
    private Integer offeredItemId;
    private ExchangeStatus status;
    private LocalDateTime requestedAt;
    private LocalDateTime respondedAt;

    public static ExchangeRequestResponseDto fromEntity(ExchangeRequest e) {
        return ExchangeRequestResponseDto.builder()
                .exchangeId(e.getExchangeId())
                .requesterId(e.getRequester().getUserId())
                .responderId(e.getResponder().getUserId())
                .requestedItemId(e.getRequestedItem().getFoodItemId())
                .offeredItemId(e.getOfferedItem().getFoodItemId())
                .status(e.getStatus())
                .requestedAt(e.getRequestedAt())
                .respondedAt(e.getRespondedAt())
                .build();
    }
}
