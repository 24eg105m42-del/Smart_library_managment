package com.smartlibrary.backend;

import com.smartlibrary.backend.dto.ChatRequest;
import com.smartlibrary.backend.dto.ChatResponse;
import com.smartlibrary.backend.service.ChatService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ChatControllerTest {

    @Autowired
    private ChatService chatService;

    @Test
    void testChatFallbackWithCatalogKnowledge() {
        ChatResponse response = chatService.chat(new ChatRequest("Which programming books are available in the library?"));
        assertNotNull(response);
        assertNotNull(response.getReply());
        assertTrue(response.getReply().length() > 0);
        // It provides catalog assistance
        assertNotNull(response.getModel());
    }

    @Test
    void testEmptyChatMessage() {
        ChatResponse response = chatService.chat(new ChatRequest(""));
        assertNotNull(response);
        assertTrue(response.getReply().contains("AI Smart Library Assistant"));
    }
}
