package org.example.feaswap.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReportRequestDto {
    private Integer reporterId;
    private Integer reportedUserId;
    private Integer reportedMessageId;
    private String reason;
}
