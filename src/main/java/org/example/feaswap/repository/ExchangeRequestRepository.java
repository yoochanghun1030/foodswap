package org.example.feaswap.repository;

import org.example.feaswap.entity.ExchangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ExchangeRequestRepository extends JpaRepository<ExchangeRequest, Integer> {

    void deleteByRequestedItem_FoodItemId(Integer foodItemId);

    void deleteByOfferedItem_FoodItemId(Integer foodItemId);

    Optional<ExchangeRequest> findByRequestedItem_FoodItemId(Integer foodItemId);
    Optional<ExchangeRequest> findByOfferedItem_FoodItemId(Integer foodItemId);
}
