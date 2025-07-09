package org.example.feaswap.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reportid", nullable = false)
    private Integer reportId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reporterid", nullable = false)
    private User reporter;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "reporteduserid", nullable = true)
    private User reportedUser;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "reportedmessageid", nullable = true)
    private Message reportedMessage;

    @Column(name = "reason", length = 255)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 9)
    private ReportStatus status;

    @Column(name = "createdat", nullable = false, insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "resolvedat", nullable = true)
    private LocalDateTime resolvedAt;
}
