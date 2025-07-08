package org.example.feaswap.dto;

import org.example.feaswap.entity.Message;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MessageResponseDto {
    private Integer messageId;
    private Integer exchangeId;
    private Integer senderId;
    private String messageText;
    private LocalDateTime sentAt;

    public static MessageResponseDto fromEntity(Message m) {
        return MessageResponseDto.builder()
                .messageId(m.getMessageId())
                .exchangeId(m.getExchange().getExchangeId())
                .senderId(m.getSender().getUserId())
                .messageText(m.getMessageText())
                .sentAt(m.getSentAt())
                .build();
    }
}
