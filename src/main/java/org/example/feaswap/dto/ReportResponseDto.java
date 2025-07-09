package org.example.feaswap.dto;

import org.example.feaswap.entity.Report;
import org.example.feaswap.entity.ReportStatus;
import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReportResponseDto {
    private Integer reportId;
    private Integer reporterId;
    private Integer reportedUserId;
    private Integer reportedMessageId;
    private String reason;
    private ReportStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;

    public static ReportResponseDto fromEntity(Report r) {
        return ReportResponseDto.builder()
                .reportId(r.getReportId())
                .reporterId(r.getReporter().getUserId())
                .reportedUserId(r.getReportedUser() != null ? r.getReportedUser().getUserId() : null)
                .reportedMessageId(r.getReportedMessage() != null ? r.getReportedMessage().getMessageId() : null)
                .reason(r.getReason())
                .status(r.getStatus())
                .createdAt(r.getCreatedAt())
                .resolvedAt(r.getResolvedAt())
                .build();
    }
}
