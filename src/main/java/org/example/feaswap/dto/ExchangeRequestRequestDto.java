package org.example.feaswap.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ExchangeRequestRequestDto {
    private Integer requesterId;
    private Integer responderId;
    private Integer requestedItemId;
    private Integer offeredItemId;
}
