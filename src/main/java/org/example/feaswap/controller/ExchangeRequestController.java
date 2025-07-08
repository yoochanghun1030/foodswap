package org.example.feaswap.controller;

import org.example.feaswap.dto.ExchangeRequestRequestDto;
import org.example.feaswap.dto.ExchangeRequestResponseDto;
import org.example.feaswap.dto.ExchangeRequestStatusUpdateDto;
import org.example.feaswap.entity.User;
import org.example.feaswap.service.ExchangeRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exchangerequests")
@RequiredArgsConstructor
public class ExchangeRequestController {

    private final ExchangeRequestService exchangeRequestService;

    @PostMapping
    public ResponseEntity<ExchangeRequestResponseDto> create(@RequestBody ExchangeRequestRequestDto dto) {
        ExchangeRequestResponseDto created = exchangeRequestService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExchangeRequestResponseDto> getOne(@PathVariable Integer id) {
        return ResponseEntity.ok(exchangeRequestService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<ExchangeRequestResponseDto>> getAll() {
        return ResponseEntity.ok(exchangeRequestService.getAll());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(
            @PathVariable Integer id,
            @RequestBody ExchangeRequestStatusUpdateDto dto,
            @AuthenticationPrincipal User user
    ) {
        exchangeRequestService.updateStatus(id, dto.getStatus(), user);
        return ResponseEntity.ok().build();
    }
}
