package org.example.feaswap.controller;

import org.example.feaswap.dto.NotificationRequestDto;
import org.example.feaswap.dto.NotificationResponseDto;
import org.example.feaswap.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<NotificationResponseDto> create(@RequestBody NotificationRequestDto dto) {
        NotificationResponseDto created = notificationService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponseDto>> getByUser(
            @RequestParam("userId") Integer userId) {
        return ResponseEntity.ok(notificationService.getByUser(userId));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponseDto> markAsRead(@PathVariable Integer id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationResponseDto>> getUserNotifications(@PathVariable Integer userId) {
        return ResponseEntity.ok(notificationService.getByUser(userId));
    }

    @PatchMapping("/mark-as-read")
    public ResponseEntity<Void> markAsRead(@RequestBody Map<String, List<Integer>> payload) {
        if (payload == null || !payload.containsKey("ids")) {
            return ResponseEntity.badRequest().build();
        }
        notificationService.markAsRead(payload.get("ids"));
        return ResponseEntity.ok().build();
    }
}
