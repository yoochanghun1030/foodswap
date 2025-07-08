package org.example.feaswap.service;

import org.example.feaswap.dto.NotificationRequestDto;
import org.example.feaswap.dto.NotificationResponseDto;
import org.example.feaswap.entity.Notification;
import org.example.feaswap.entity.User;
import org.example.feaswap.repository.NotificationRepository;
import org.example.feaswap.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public NotificationResponseDto create(NotificationRequestDto dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found: " + dto.getUserId()));

        Notification notice = Notification.builder()
                .user(user)
                .type(dto.getType())
                .content(dto.getContent())
                .isRead(false)
                .build();

        Notification saved = notificationRepository.save(notice);
        return NotificationResponseDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponseDto> getByUser(Integer userId) {
        return notificationRepository.findByUser_UserId(userId).stream()
                .map(NotificationResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public NotificationResponseDto markAsRead(Integer id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found: " + id));
        n.setIsRead(true);
        Notification updated = notificationRepository.save(n);
        return NotificationResponseDto.fromEntity(updated);
    }

    @Transactional
    public void markAsRead(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) return;
        List<Notification> notifications = notificationRepository.findAllById(ids);
        for (Notification n : notifications) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(notifications);
    }


}
