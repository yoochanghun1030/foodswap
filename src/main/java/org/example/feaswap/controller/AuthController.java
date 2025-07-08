package org.example.feaswap.controller;

import org.example.feaswap.entity.User;
import org.example.feaswap.entity.Role;
import lombok.RequiredArgsConstructor;
import org.example.feaswap.dto.JwtResponseDto;
import org.example.feaswap.dto.LoginRequestDto;
import org.example.feaswap.dto.RegisterRequestDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.example.feaswap.repository.UserRepository;
import org.example.feaswap.util.JwtUtil;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<JwtResponseDto> login(@RequestBody LoginRequestDto request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = jwtUtil.generateToken(authentication);

        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(new JwtResponseDto(
                token,
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDto request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("This email already exists.");
        }

        Role assignedRole = userRepository.count() == 0 ? Role.ADMIN : Role.USER;

        User user = User.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(assignedRole)
                .build();

        userRepository.save(user);
        return ResponseEntity.ok("Membership registration successful");
    }
}
