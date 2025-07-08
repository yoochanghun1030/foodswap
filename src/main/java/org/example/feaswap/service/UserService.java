package org.example.feaswap.service;

import org.example.feaswap.dto.UserRequestDto;
import org.example.feaswap.dto.UserResponseDto;
import org.example.feaswap.entity.User;
import org.example.feaswap.entity.Role;
import org.example.feaswap.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponseDto register(UserRequestDto dto) {
        Role assigned = (userRepository.count() == 0)
                ? Role.ADMIN
                : Role.USER;

        User user = User.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                .passwordHash(passwordEncoder.encode(dto.getPassword()))
                .phone(dto.getPhone())
                .location(dto.getLocation())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .role(assigned)
                .build();

        User saved = userRepository.save(user);
        return UserResponseDto.fromEntity(saved);
    }

    public UserResponseDto getById(Integer id) {
        User u = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        return UserResponseDto.fromEntity(u);
    }
}
