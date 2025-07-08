package org.example.feaswap.dto;

import org.example.feaswap.entity.Notification;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class NotificationResponseDto {
    private Integer notificationId;
    private Integer userId;
    private String type;
    private String content;
    private Boolean isRead;
    private LocalDateTime createdAt;

    public static NotificationResponseDto fromEntity(Notification n) {
        return NotificationResponseDto.builder()
                .notificationId(n.getNotificationId())
                .userId(n.getUser().getUserId())
                .type(n.getType())
                .content(n.getContent())
                .isRead(n.getIsRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
