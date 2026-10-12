package com.smartlibrary.backend.service;

import com.smartlibrary.backend.dto.ChatRequest;
import com.smartlibrary.backend.dto.ChatResponse;
import com.smartlibrary.backend.model.Book;
import com.smartlibrary.backend.repository.BookRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatServiceImpl implements ChatService {

    private static final Logger logger = LoggerFactory.getLogger(ChatServiceImpl.class);

    private final ChatClient chatClient;
    private final BookRepository bookRepository;

    @Value("${spring.ai.google.genai.api-key:}")
    private String geminiApiKey;

    public ChatServiceImpl(ChatClient.Builder chatClientBuilder, BookRepository bookRepository) {
        this.bookRepository = bookRepository;
        ChatClient client = null;
        try {
            if (chatClientBuilder != null) {
                client = chatClientBuilder.build();
            }
        } catch (Exception e) {
            logger.warn("Could not initialize ChatClient from builder: {}", e.getMessage());
        }
        this.chatClient = client;
    }

    @Override
    public ChatResponse chat(String message) {
        return chat(new ChatRequest(message));
    }

    @Override
    public ChatResponse chat(ChatRequest request) {
        String userMessage = request != null && request.getMessage() != null ? request.getMessage().trim() : "";

        if (userMessage.isEmpty()) {
            return new ChatResponse(
                    "Hello! I am your AI Smart Library Assistant. How can I help you today? You can ask me about available books, study recommendations, or library topics.",
                    "system",
                    false
            );
        }

        if (userMessage.length() > 2000) {
            return new ChatResponse(
                    "Your message is too long (maximum 2000 characters). Please send a shorter query.",
                    "system",
                    false
            );
        }

        // Check if API key is configured and not default dummy
        boolean hasValidKey = geminiApiKey != null && !geminiApiKey.isBlank() && !geminiApiKey.equals("demo-key");

        if (chatClient != null && hasValidKey) {
            try {
                String systemPrompt = buildSystemPrompt();

                String aiResponse = chatClient.prompt()
                        .system(systemPrompt)
                        .user(userMessage)
                        .call()
                        .content();

                if (aiResponse != null && !aiResponse.isBlank()) {
                    return new ChatResponse(aiResponse, "gemini-2.5-flash", false);
                }
            } catch (Exception ex) {
                logger.error("Error communicating with Google Gemini: {}", ex.getMessage());
                // Fall back gracefully to catalog assistant
                return buildFallbackResponse(userMessage, "Google Gemini service is temporarily unavailable (" + ex.getClass().getSimpleName() + "). Showing catalog assistance instead.");
            }
        }

        // Fallback when API key is missing or not configured
        return buildFallbackResponse(userMessage, "Gemini API key is not yet configured or verified. Providing built-in catalog assistant response.");
    }

    private String buildSystemPrompt() {
        List<Book> books = bookRepository.findAll();
        StringBuilder catalogSummary = new StringBuilder();
        catalogSummary.append("CURRENT LIBRARY CATALOG:\n");

        if (books.isEmpty()) {
            catalogSummary.append("The library catalog currently has no books registered.\n");
        } else {
            for (Book b : books) {
                catalogSummary.append(String.format("- ID %d: '%s' by %s [Category: %s, Status: %s]\n",
                        b.getId(),
                        b.getTitle(),
                        b.getAuthor(),
                        b.getCategory(),
                        b.isAvailable() ? "Available" : "Checked Out / Unavailable"));
            }
        }

        return "You are 'Athena', the friendly and knowledgeable AI Assistant for the AI Smart Library Management System.\n" +
                "Your role is to help students, faculty, and librarians discover books, check real-time availability, get study plans, and find learning resources.\n" +
                "IMPORTANT INSTRUCTIONS:\n" +
                "1. Refer to the real library catalog provided below when answering questions about available books or specific titles. Do NOT invent books as existing in this library if they are not in the catalog.\n" +
                "2. If a student asks for books in a subject (e.g. Java, Databases, Networks), recommend relevant books from our catalog and indicate whether they are currently Available.\n" +
                "3. If a student asks general conceptual or academic questions (e.g., explaining OOP concepts or algorithms), provide clear, insightful explanations with study advice.\n" +
                "4. Maintain a warm, encouraging, and professional academic tone.\n\n" +
                catalogSummary.toString();
    }

    private ChatResponse buildFallbackResponse(String userMessage, String note) {
        String lower = userMessage.toLowerCase();
        List<Book> allBooks = bookRepository.findAll();

        StringBuilder sb = new StringBuilder();
        sb.append("📚 **AI Smart Library Assistant** (Built-in Mode)\n\n");

        if (lower.contains("java") || lower.contains("program") || lower.contains("code")) {
            sb.append("Here are programming books currently in our catalog:\n\n");
            appendMatchingBooks(sb, allBooks, "programming", "java");
        } else if (lower.contains("database") || lower.contains("sql") || lower.contains("db")) {
            sb.append("Here are database books currently in our catalog:\n\n");
            appendMatchingBooks(sb, allBooks, "database");
        } else if (lower.contains("network") || lower.contains("tanenbaum")) {
            sb.append("Here are networking books in our catalog:\n\n");
            appendMatchingBooks(sb, allBooks, "network");
        } else if (lower.contains("available") || lower.contains("all book") || lower.contains("list") || lower.contains("catalog")) {
            sb.append("Here is the current catalog status:\n\n");
            for (Book b : allBooks) {
                sb.append(String.format("• **%s** by %s (%s) — *%s*\n",
                        b.getTitle(), b.getAuthor(), b.getCategory(), b.isAvailable() ? "✅ Available" : "❌ Checked out"));
            }
        } else {
            sb.append("I am ready to help you with the library catalog! We currently have **")
              .append(allBooks.size())
              .append("** books across categories like Programming, Database, Networking, AI, and Mathematics.\n\n")
              .append("Try asking:\n")
              .append("- *\"Which programming books are available?\"*\n")
              .append("- *\"Show database books\"*\n")
              .append("- *\"List all available books\"*\n\n");
        }

        sb.append("\n> *Note: ").append(note).append("*");

        return new ChatResponse(sb.toString(), "catalog-assistant", true);
    }

    private void appendMatchingBooks(StringBuilder sb, List<Book> books, String... terms) {
        List<Book> matched = books.stream().filter(b -> {
            for (String t : terms) {
                if ((b.getTitle() != null && b.getTitle().toLowerCase().contains(t)) ||
                    (b.getCategory() != null && b.getCategory().toLowerCase().contains(t))) {
                    return true;
                }
            }
            return false;
        }).collect(Collectors.toList());

        if (matched.isEmpty()) {
            sb.append("No books directly matched that topic in our current inventory.\n");
        } else {
            for (Book b : matched) {
                sb.append(String.format("• **%s** by %s — %s\n",
                        b.getTitle(), b.getAuthor(), b.isAvailable() ? "✅ Available" : "❌ Checked Out"));
            }
        }
    }
}
