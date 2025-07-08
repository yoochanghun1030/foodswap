package org.example.feaswap.controller;

import org.example.feaswap.dto.FoodItemRequestDto;
import org.example.feaswap.dto.FoodItemResponseDto;
import org.example.feaswap.service.FoodItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.example.feaswap.entity.User;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/food")
@RequiredArgsConstructor
public class FoodItemController {

    private final FoodItemService foodItemService;

    @PostMapping
    public ResponseEntity<FoodItemResponseDto> create(
            @RequestBody FoodItemRequestDto dto,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        FoodItemResponseDto created = foodItemService.create(dto, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<FoodItemResponseDto> createWithImage(
            @RequestPart("food") FoodItemRequestDto dto,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();
        FoodItemResponseDto created =
                foodItemService.create(dto, imageFile, user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodItemResponseDto> getOne(@PathVariable Integer id) {
        return ResponseEntity.ok(foodItemService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<FoodItemResponseDto>> getAllFoodItems() {
        List<FoodItemResponseDto> items = foodItemService.getAllFoodItems();
        return ResponseEntity.ok(items);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        foodItemService.delete(id, user.getUserId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<Void> markAsCompleted(@PathVariable Integer id) {
        foodItemService.markAsCompleted(id);
        return ResponseEntity.ok().build();
    }

}
