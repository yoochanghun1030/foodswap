package org.example.feaswap.dto;

import org.example.feaswap.entity.ExchangeStatus;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ExchangeRequestStatusUpdateDto {
    private ExchangeStatus status;
}
