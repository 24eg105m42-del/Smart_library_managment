package com.smartlibrary.backend.service;

import com.smartlibrary.backend.dto.AuthResponse;
import com.smartlibrary.backend.dto.LoginRequest;
import com.smartlibrary.backend.dto.RegisterRequest;
import com.smartlibrary.backend.dto.UserDto;

public interface UserService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    UserDto getProfileByEmail(String email);
}
