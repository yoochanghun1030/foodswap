package org.example.feaswap.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reviewid", nullable = false)
    private Integer reviewId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "exchangeid", nullable = false)
    private ExchangeRequest exchange;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reviewerid", nullable = false)
    private User reviewer;

    @Column(name = "rating", nullable = false)
    private Integer rating; // 1~5

    @Column(name = "comment", columnDefinition = "TEXT", nullable = true)
    private String comment;

    /**
     * DB Default CURRENT_TIMESTAMP
     * insertable=false, updatable=false
     */
    @Column(name = "createdat", nullable = false, insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
