package org.example.feaswap.repository;

import org.example.feaswap.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Integer> {
    List<Message> findByExchange_ExchangeId(Integer exchangeId);
}
