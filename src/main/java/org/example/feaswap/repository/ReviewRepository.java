package org.example.feaswap.repository;

import org.example.feaswap.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByExchange_ExchangeId(Integer exchangeId);
    List<Review> findByReviewer_UserId(Integer reviewerId);
}
