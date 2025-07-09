package org.example.feaswap.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "exchangerequests")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ExchangeRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exchangeid", nullable = false)
    private Integer exchangeId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "requesterid", nullable = false)
    private User requester;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "responderid", nullable = false)
    private User responder;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "requesteditemid", nullable = false)
    private FoodItem requestedItem;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "offereditemid", nullable = false)
    private FoodItem offeredItem;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 9)
    private ExchangeStatus status;

    @Column(name = "requestedat", nullable = false, insertable = false, updatable = false)
    private LocalDateTime requestedAt;

    @Column(name = "respondedat", nullable = true)
    private LocalDateTime respondedAt;
}
