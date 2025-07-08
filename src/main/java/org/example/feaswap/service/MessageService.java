package org.example.feaswap.service;

import org.example.feaswap.dto.MessageRequestDto;
import org.example.feaswap.dto.MessageResponseDto;
import org.example.feaswap.entity.ExchangeRequest;
import org.example.feaswap.entity.Message;
import org.example.feaswap.entity.User;
import org.example.feaswap.repository.ExchangeRequestRepository;
import org.example.feaswap.repository.MessageRepository;
import org.example.feaswap.repository.NotificationRepository;
import org.example.feaswap.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.example.feaswap.entity.Notification;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final NotificationRepository notificationRepository;
    private final MessageRepository messageRepository;
    private final ExchangeRequestRepository exchangeRepository;
    private final UserRepository userRepository;

    @Transactional
    public MessageResponseDto create(MessageRequestDto dto) {
        ExchangeRequest ex = exchangeRepository.findById(dto.getExchangeId())
                .orElseThrow(() -> new RuntimeException("Exchange not found: " + dto.getExchangeId()));
        User sender = userRepository.findById(dto.getSenderId())
                .orElseThrow(() -> new RuntimeException("User not found: " + dto.getSenderId()));

        Message msg = Message.builder()
                .exchange(ex)
                .sender(sender)
                .messageText(dto.getMessageText())
                .build();

        Message saved = messageRepository.save(msg);

        Integer receiverId = (ex.getRequester().getUserId().equals(dto.getSenderId()))
                ? ex.getResponder().getUserId()
                : ex.getRequester().getUserId();

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found: " + receiverId));

        Notification notification = Notification.builder()
                .user(receiver)
                .type("MESSAGE")
                .content("💬 A new message has arrived.")
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);

        return MessageResponseDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public MessageResponseDto getById(Integer id) {
        return messageRepository.findById(id)
                .map(MessageResponseDto::fromEntity)
                .orElseThrow(() -> new RuntimeException("Message not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDto> getByExchange(Integer exchangeId) {
        return messageRepository.findByExchange_ExchangeId(exchangeId).stream()
                .map(MessageResponseDto::fromEntity)
                .collect(Collectors.toList());
    }
}
