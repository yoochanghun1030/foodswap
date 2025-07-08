package org.example.feaswap.dto;

import org.example.feaswap.entity.ReportStatus;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReportStatusUpdateDto {
    private ReportStatus status;
}
