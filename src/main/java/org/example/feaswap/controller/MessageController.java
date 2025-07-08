package org.example.feaswap.controller;

import org.example.feaswap.dto.MessageRequestDto;
import org.example.feaswap.dto.MessageResponseDto;
import org.example.feaswap.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<MessageResponseDto> create(@RequestBody MessageRequestDto dto) {
        MessageResponseDto created = messageService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MessageResponseDto> getOne(@PathVariable Integer id) {
        return ResponseEntity.ok(messageService.getById(id));
    }

    @GetMapping("/exchange/{exchangeId}")
    public ResponseEntity<List<MessageResponseDto>> getByExchangeId(
            @PathVariable Integer exchangeId) {
        return ResponseEntity.ok(messageService.getByExchange(exchangeId));
    }
}
