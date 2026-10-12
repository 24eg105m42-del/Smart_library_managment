package com.smartlibrary.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class HelloController {

    @GetMapping("/api/hello")
    public ResponseEntity<Map<String, Object>> hello() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("message", "Hello from Smart Library Backend!");
        status.put("timestamp", LocalDateTime.now());
        status.put("service", "AI-Smart-Library-Backend");
        status.put("version", "1.0.0");
        return ResponseEntity.ok(status);
    }
}