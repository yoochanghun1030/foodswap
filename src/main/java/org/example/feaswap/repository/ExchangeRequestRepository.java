package org.example.feaswap.repository;

import org.example.feaswap.entity.ExchangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExchangeRequestRepository extends JpaRepository<ExchangeRequest, Integer> {

    void deleteByRequestedItem_FoodItemId(Integer foodItemId);

    void deleteByOfferedItem_FoodItemId(Integer foodItemId);
}
