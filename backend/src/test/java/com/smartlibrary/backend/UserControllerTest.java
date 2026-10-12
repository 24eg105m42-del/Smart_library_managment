package com.smartlibrary.backend;

import com.smartlibrary.backend.dto.LoginRequest;
import com.smartlibrary.backend.dto.RegisterRequest;
import com.smartlibrary.backend.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class UserControllerTest {

    @Autowired
    private UserService userService;

    @Test
    void testRegistrationSuccess() {
        RegisterRequest req = new RegisterRequest("Test Student", "teststudent@smartlibrary.com", "password123");
        var response = userService.register(req);

        assertNotNull(response);
        assertEquals("Registration successful", response.getMessage());
        assertNotNull(response.getToken());
        assertNotNull(response.getUser());
        assertEquals("STUDENT", response.getUser().getRole());
        assertEquals("teststudent@smartlibrary.com", response.getUser().getEmail());
    }

    @Test
    void testDuplicateRegistrationFails() {
        RegisterRequest req1 = new RegisterRequest("Student One", "duplicate@smartlibrary.com", "secret123");
        userService.register(req1);

        RegisterRequest req2 = new RegisterRequest("Student Two", "duplicate@smartlibrary.com", "secret456");
        assertThrows(RuntimeException.class, () -> userService.register(req2));
    }

    @Test
    void testLoginSuccess() {
        RegisterRequest req = new RegisterRequest("Login User", "loginuser@smartlibrary.com", "mypassword");
        userService.register(req);

        LoginRequest loginReq = new LoginRequest("loginuser@smartlibrary.com", "mypassword");
        var authResponse = userService.login(loginReq);

        assertNotNull(authResponse);
        assertEquals("Login successful", authResponse.getMessage());
        assertNotNull(authResponse.getToken());
    }

    @Test
    void testLoginInvalidPasswordFails() {
        RegisterRequest req = new RegisterRequest("Bob", "bob@smartlibrary.com", "correctpassword");
        userService.register(req);

        LoginRequest loginReq = new LoginRequest("bob@smartlibrary.com", "wrongpassword");
        assertThrows(RuntimeException.class, () -> userService.login(loginReq));
    }
}
