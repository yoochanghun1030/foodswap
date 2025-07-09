package org.example.feaswap.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MessageRequestDto {
    private Integer exchangeId;
    private Integer senderId;
    private String messageText;
}
