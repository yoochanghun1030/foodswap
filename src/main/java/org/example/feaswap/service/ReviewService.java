package org.example.feaswap.service;

import org.example.feaswap.dto.ReviewRequestDto;
import org.example.feaswap.dto.ReviewResponseDto;
import org.example.feaswap.entity.ExchangeRequest;
import org.example.feaswap.entity.Review;
import org.example.feaswap.entity.User;
import org.example.feaswap.repository.ExchangeRequestRepository;
import org.example.feaswap.repository.ReviewRepository;
import org.example.feaswap.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ExchangeRequestRepository exchangeRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReviewResponseDto create(ReviewRequestDto dto) {
        ExchangeRequest ex = exchangeRepository.findById(dto.getExchangeId())
                .orElseThrow(() -> new RuntimeException("ExchangeRequest not found: " + dto.getExchangeId()));
        User reviewer = userRepository.findById(dto.getReviewerId())
                .orElseThrow(() -> new RuntimeException("User not found: " + dto.getReviewerId()));

        Review rev = Review.builder()
                .exchange(ex)
                .reviewer(reviewer)
                .rating(dto.getRating())
                .comment(dto.getComment())
                .build();

        Review saved = reviewRepository.save(rev);
        return ReviewResponseDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public ReviewResponseDto getById(Integer id) {
        return reviewRepository.findById(id)
                .map(ReviewResponseDto::fromEntity)
                .orElseThrow(() -> new RuntimeException("Review not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<ReviewResponseDto> getByExchange(Integer exchangeId) {
        return reviewRepository.findByExchange_ExchangeId(exchangeId).stream()
                .map(ReviewResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReviewResponseDto> getByReviewer(Integer reviewerId) {
        return reviewRepository.findByReviewer_UserId(reviewerId).stream()
                .map(ReviewResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReviewResponseDto> getAll() {
        return reviewRepository.findAll().stream()
                .map(ReviewResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

}
