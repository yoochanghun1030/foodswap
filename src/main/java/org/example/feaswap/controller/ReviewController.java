package org.example.feaswap.controller;

import org.example.feaswap.dto.ReviewRequestDto;
import org.example.feaswap.dto.ReviewResponseDto;
import org.example.feaswap.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewResponseDto> create(@RequestBody ReviewRequestDto dto) {
        ReviewResponseDto created = reviewService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponseDto> getOne(@PathVariable Integer id) {
        return ResponseEntity.ok(reviewService.getById(id));
    }

    @GetMapping("/reviewer/{reviewerId}")
    public ResponseEntity<List<ReviewResponseDto>> getAll(
            @RequestParam(value = "exchangeId", required = false) Integer exchangeId,
            @RequestParam(value = "reviewerId", required = false) Integer reviewerId
    ) {
        List<ReviewResponseDto> list;
        if (exchangeId != null) {
            list = reviewService.getByExchange(exchangeId);
        } else if (reviewerId != null) {
            list = reviewService.getByReviewer(reviewerId);
        } else {
            list = reviewService.getAll();
        }
        return ResponseEntity.ok(list);
    }

}
