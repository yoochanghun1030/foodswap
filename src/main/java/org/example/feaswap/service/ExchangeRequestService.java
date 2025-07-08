package org.example.feaswap.service;

import org.example.feaswap.dto.ExchangeRequestRequestDto;
import org.example.feaswap.dto.ExchangeRequestResponseDto;
import org.example.feaswap.entity.ExchangeRequest;
import org.example.feaswap.entity.ExchangeStatus;
import org.example.feaswap.entity.FoodItem;
import org.example.feaswap.entity.User;
import org.example.feaswap.repository.ExchangeRequestRepository;
import org.example.feaswap.repository.FoodItemRepository;
import org.example.feaswap.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExchangeRequestService {

    private final ExchangeRequestRepository exchangeRequestRepository;
    private final UserRepository userRepository;
    private final FoodItemRepository foodItemRepository;

    @Transactional
    public ExchangeRequestResponseDto create(ExchangeRequestRequestDto dto) {
        User requester = userRepository.findById(dto.getRequesterId())
                .orElseThrow(() -> new RuntimeException("User not found: " + dto.getRequesterId()));
        User responder = userRepository.findById(dto.getResponderId())
                .orElseThrow(() -> new RuntimeException("User not found: " + dto.getResponderId()));
        FoodItem requestedItem = foodItemRepository.findById(dto.getRequestedItemId())
                .orElseThrow(() -> new RuntimeException("FoodItem not found: " + dto.getRequestedItemId()));
        FoodItem offeredItem = foodItemRepository.findById(dto.getOfferedItemId())
                .orElseThrow(() -> new RuntimeException("FoodItem not found: " + dto.getOfferedItemId()));

        ExchangeRequest entity = ExchangeRequest.builder()
                .requester(requester)
                .responder(responder)
                .requestedItem(requestedItem)
                .offeredItem(offeredItem)
                .status(ExchangeStatus.PENDING)
                .build();

        ExchangeRequest saved = exchangeRequestRepository.save(entity);
        return ExchangeRequestResponseDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public ExchangeRequestResponseDto getById(Integer id) {
        return exchangeRequestRepository.findById(id)
                .map(ExchangeRequestResponseDto::fromEntity)
                .orElseThrow(() -> new RuntimeException("ExchangeRequest not found: " + id));
    }

    @Transactional(readOnly = true)
    public ExchangeRequestResponseDto getByFoodItemId(Integer foodItemId) {
        return exchangeRequestRepository.findByRequestedItem_FoodItemId(foodItemId)
                .map(ExchangeRequestResponseDto::fromEntity)
                .or(() -> exchangeRequestRepository.findByOfferedItem_FoodItemId(foodItemId)
                        .map(ExchangeRequestResponseDto::fromEntity))
                .orElseThrow(() -> new RuntimeException("ExchangeRequest not found for foodItemId: " + foodItemId));
    }

    @Transactional(readOnly = true)
    public List<ExchangeRequestResponseDto> getAll() {
        return exchangeRequestRepository.findAll().stream()
                .map(ExchangeRequestResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateStatus(Integer id, ExchangeStatus status, User user) {
        ExchangeRequest request = exchangeRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ExchangeRequest not found: " + id));

        boolean isRequester = request.getRequester().getUserId().equals(user.getUserId());
        boolean isResponder = request.getResponder().getUserId().equals(user.getUserId());

        if (!isRequester && !isResponder) {
            throw new AccessDeniedException("You are not authorized to update this exchange.");
        }

        if (request.getStatus() != ExchangeStatus.PENDING) {
            throw new IllegalStateException("Exchange request is already processed.");
        }

        request.setStatus(status);

        if (status == ExchangeStatus.ACCEPTED) {
            FoodItem requestedItem = request.getRequestedItem();
            FoodItem offeredItem = request.getOfferedItem();

            requestedItem.setIsCompleted(true);
            offeredItem.setIsCompleted(true);

            foodItemRepository.save(requestedItem);
            foodItemRepository.save(offeredItem);
        }
    }

}
