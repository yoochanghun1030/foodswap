package org.example.feaswap.service;

import lombok.Getter;
import org.example.feaswap.dto.FoodItemRequestDto;
import org.example.feaswap.dto.FoodItemResponseDto;
import org.example.feaswap.entity.FoodItem;
import org.example.feaswap.entity.User;
import org.example.feaswap.repository.ExchangeRequestRepository;
import org.example.feaswap.repository.FoodItemRepository;
import org.example.feaswap.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
@Getter
@Service
@RequiredArgsConstructor
public class FoodItemService {

    private final FoodItemRepository foodItemRepository;
    private final UserRepository userRepository;
    private final ExchangeRequestRepository exchangeRequestRepository;
    private final FileStorageService fileStorageService;

    @Transactional
    public FoodItemResponseDto create(FoodItemRequestDto dto, User owner) {
        FoodItem entity = toEntity(dto, dto.getImageUrl(), owner);
        FoodItem saved = foodItemRepository.save(entity);
        return FoodItemResponseDto.fromEntity(saved);
    }

    @Transactional
    public FoodItemResponseDto create(
            FoodItemRequestDto dto,
            MultipartFile imageFile,
            User owner) {

        String imageUrl = dto.getImageUrl();
        if (imageFile != null && !imageFile.isEmpty()) {
            imageUrl = fileStorageService.store(imageFile);
        }

        FoodItem entity = toEntity(dto, imageUrl, owner);
        FoodItem saved = foodItemRepository.save(entity);
        return FoodItemResponseDto.fromEntity(saved);
    }

    private FoodItem toEntity(
            FoodItemRequestDto dto,
            String imageUrl,
            User owner
    ) {
        String nutritionJson = dto.getNutritionFacts();
        if (!StringUtils.hasText(nutritionJson)) {
            nutritionJson = null;
        }

        return FoodItem.builder()
                .owner(owner)
                .title(dto.getTitle())
                .category(dto.getCategory())
                .quantity(dto.getQuantity())
                .unit(dto.getUnit())
                .availableFrom(dto.getAvailableFrom())
                .availableUntil(dto.getAvailableUntil())
                .imageUrl(imageUrl)
                .nutritionFacts(nutritionJson)
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .isCompleted(false)
                .build();
    }

    @Transactional(readOnly = true)
    public FoodItemResponseDto getById(Integer id) {
        return foodItemRepository.findById(id)
                .map(FoodItemResponseDto::fromEntity)
                .orElseThrow(() -> new RuntimeException("FoodItem not found: " + id));
    }

    public List<FoodItemResponseDto> getAllFoodItems() {
        List<FoodItem> items = foodItemRepository.findAll();
        return items.stream().map(FoodItemResponseDto::fromEntity).toList();
    }

    @Transactional
    public void delete(Integer foodItemId, Integer userId) {

        FoodItem foodItem = foodItemRepository.findById(foodItemId)
                .orElseThrow(() -> new RuntimeException("The food does not exist."));


        if (!foodItem.getOwner().getUserId().equals(userId)) {
            throw new AccessDeniedException("You can only delete the foods you registered..");
        }

        exchangeRequestRepository.deleteByRequestedItem_FoodItemId(foodItemId);
        exchangeRequestRepository.deleteByOfferedItem_FoodItemId(foodItemId);

        foodItemRepository.deleteById(foodItemId);
    }

    @Transactional
    public void markAsCompleted(Integer foodItemId) {
        FoodItem item = foodItemRepository.findById(foodItemId)
                .orElseThrow(() -> new RuntimeException("Food item not found"));
        item.setIsCompleted(true);
    }

}
