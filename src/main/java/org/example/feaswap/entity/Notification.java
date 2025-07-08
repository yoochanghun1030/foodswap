package org.example.feaswap.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.Builder;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notificationid", nullable = false)
    private Integer notificationId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "userid", nullable = false)
    private User user;

    @Column(name = "type", length = 50)
    private String type;

    @Column(name = "content", length = 255)
    private String content;

    @Column(name = "isread", nullable = false)
    private Boolean isRead;

    @Column(name = "createdat", nullable = false, insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
