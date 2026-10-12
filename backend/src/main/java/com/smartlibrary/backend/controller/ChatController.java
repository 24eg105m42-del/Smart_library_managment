package com.smartlibrary.backend.controller;

import com.smartlibrary.backend.dto.ChatRequest;
import com.smartlibrary.backend.dto.ChatResponse;
import com.smartlibrary.backend.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    // GET /api/chat?message=... (Preserves backwards compatibility)
    @GetMapping
    public ResponseEntity<ChatResponse> chatGet(@RequestParam(required = false, defaultValue = "") String message) {
        ChatResponse response = chatService.chat(message);
        return ResponseEntity.ok(response);
    }

    // POST /api/chat (Recommended for longer messages and robust JSON payloads)
    @PostMapping
    public ResponseEntity<ChatResponse> chatPost(@Valid @RequestBody ChatRequest request) {
        ChatResponse response = chatService.chat(request);
        return ResponseEntity.ok(response);
    }
}