package org.example.feaswap.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class NotificationRequestDto {
    private Integer userId;
    private String type;
    private String content;
}
