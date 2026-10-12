package com.smartlibrary.backend.service;

import com.smartlibrary.backend.dto.AuthResponse;
import com.smartlibrary.backend.dto.LoginRequest;
import com.smartlibrary.backend.dto.RegisterRequest;
import com.smartlibrary.backend.dto.UserDto;
import com.smartlibrary.backend.exception.BadRequestException;
import com.smartlibrary.backend.exception.ResourceNotFoundException;
import com.smartlibrary.backend.model.User;
import com.smartlibrary.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new BadRequestException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        // Enforce STUDENT role during public registration for security
        user.setRole("STUDENT");

        User savedUser = userRepository.save(user);

        String token = generateToken(savedUser);
        UserDto userDto = toDto(savedUser);

        return new AuthResponse("Registration successful", token, userDto);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        String token = generateToken(user);
        UserDto userDto = toDto(user);

        return new AuthResponse("Login successful", token, userDto);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getProfileByEmail(String email) {
        User user = userRepository.findByEmailIgnoreCase(email.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return toDto(user);
    }

    private String generateToken(User user) {
        return "sl-" + UUID.randomUUID().toString().replace("-", "") + "-" + user.getId();
    }

    private UserDto toDto(User user) {
        return new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
