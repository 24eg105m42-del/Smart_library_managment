package com.smartlibrary.backend.service;

import com.smartlibrary.backend.dto.ChatRequest;
import com.smartlibrary.backend.dto.ChatResponse;

public interface ChatService {

    ChatResponse chat(String message);

    ChatResponse chat(ChatRequest request);
}
