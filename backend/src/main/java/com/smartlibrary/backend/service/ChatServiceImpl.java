package com.smartlibrary.backend.service;

import com.smartlibrary.backend.dto.ChatRequest;
import com.smartlibrary.backend.dto.ChatResponse;
import com.smartlibrary.backend.model.Book;
import com.smartlibrary.backend.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class ChatServiceImpl implements ChatService {

    private final BookRepository bookRepository;

    public ChatServiceImpl(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
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
                    "Hello! I am Athena, your Smart Library Assistant. How can I help you today? You can ask me to search books, check availability, or get recommendations by subject.",
                    "smart-assistant",
                    false
            );
        }

        if (userMessage.length() > 2000) {
            return new ChatResponse(
                    "Your message is too long (maximum 2000 characters). Please send a shorter query.",
                    "smart-assistant",
                    false
            );
        }

        String lower = userMessage.toLowerCase(Locale.ROOT);
        List<Book> allBooks = bookRepository.findAll();

        // 1. Greetings & Identity
        if (matchesAny(lower, "hello", "hi", "hey", "who are you", "what can you do", "help")) {
            return new ChatResponse(
                    "👋 **Hello! I'm Athena, your Smart Library Assistant.**\n\n" +
                    "I am directly connected to our library database. Here is what I can do for you:\n" +
                    "• **Check book availability** (e.g. *\"Which books are available right now?\"*)\n" +
                    "• **Find books by topic** (e.g. *\"Show programming books\"* or *\"Recommend database books\"*)\n" +
                    "• **Search by title or author** (e.g. *\"Find Clean Code\"*)\n" +
                    "• **Library guide & borrowing rules** (e.g. *\"How do I borrow a book?\"*)\n\n" +
                    "Our library currently holds **" + allBooks.size() + " books** in catalog.",
                    "smart-assistant",
                    false
            );
        }

        // 2. Borrowing, returning, and library policies
        if (matchesAny(lower, "borrow", "issue", "rent", "take book", "loan")) {
            return new ChatResponse(
                    "📖 **How to Borrow Books:**\n\n" +
                    "1. Sign in to your **Student Portal** account.\n" +
                    "2. Navigate to the **Catalog** tab.\n" +
                    "3. Find any book labeled **Available** and click **Issue Book**.\n" +
                    "4. Books are typically loaned for 14 days. Make sure to return them on time to avoid overdue holds!",
                    "smart-assistant",
                    false
            );
        }

        if (matchesAny(lower, "return", "give back", "due date", "fine")) {
            return new ChatResponse(
                    "🔄 **Returning Books:**\n\n" +
                    "• You can view and manage your active loans in your **Student Dashboard**.\n" +
                    "• Click **Return** next to the borrowed book to mark it returned.\n" +
                    "• The book status will instantly switch back to **Available** for other students.",
                    "smart-assistant",
                    false
            );
        }

        // 3. Full catalog / available books list
        if (matchesAny(lower, "all book", "show catalog", "list book", "what books do you have", "show all")) {
            StringBuilder sb = new StringBuilder("📚 **Library Catalog Overview (" + allBooks.size() + " Total Books):**\n\n");
            if (allBooks.isEmpty()) {
                sb.append("The library catalog currently has no books registered. Check back soon or add books through the librarian portal.");
            } else {
                for (Book b : allBooks) {
                    sb.append(String.format("• **%s** by %s (%s) — %s\n",
                            b.getTitle(), b.getAuthor(), b.getCategory(), b.isAvailable() ? "✅ Available" : "❌ Checked Out"));
                }
            }
            return new ChatResponse(sb.toString(), "smart-assistant", false);
        }

        if (matchesAny(lower, "available", "available book", "in stock", "ready to borrow")) {
            List<Book> availableBooks = allBooks.stream().filter(Book::isAvailable).collect(Collectors.toList());
            StringBuilder sb = new StringBuilder("✅ **Currently Available Books (" + availableBooks.size() + " Available):**\n\n");
            if (availableBooks.isEmpty()) {
                sb.append("All books are currently checked out! Please check back later.");
            } else {
                for (Book b : availableBooks) {
                    sb.append(String.format("• **%s** by %s — *%s* (ID: %d)\n",
                            b.getTitle(), b.getAuthor(), b.getCategory(), b.getId()));
                }
            }
            return new ChatResponse(sb.toString(), "smart-assistant", false);
        }

        // 4. Topic-based recommendations
        if (matchesAny(lower, "program", "java", "python", "code", "coding", "software", "c++", "c#", "rust", "javascript")) {
            return buildTopicResponse("Programming & Software Development", allBooks, "programming", "java", "python", "code", "software", "development");
        }

        if (matchesAny(lower, "database", "sql", "db", "mysql", "postgres", "nosql", "mongodb")) {
            return buildTopicResponse("Databases & Data Management", allBooks, "database", "sql", "data");
        }

        if (matchesAny(lower, "network", "networking", "tanenbaum", "tcp", "ip", "security", "cyber")) {
            return buildTopicResponse("Computer Networks & Systems", allBooks, "network", "system", "security");
        }

        if (matchesAny(lower, "ai", "artificial intelligence", "machine learning", "ml", "deep learning", "neural")) {
            return buildTopicResponse("Artificial Intelligence & Machine Learning", allBooks, "ai", "intelligence", "machine learning", "data science");
        }

        if (matchesAny(lower, "algorithm", "data structure", "dsa", "leetcode", "complexity")) {
            return buildTopicResponse("Algorithms & Data Structures", allBooks, "algorithm", "structure", "dsa", "programming");
        }

        if (matchesAny(lower, "math", "calculus", "linear algebra", "discrete", "statistic")) {
            return buildTopicResponse("Mathematics & Engineering Foundations", allBooks, "math", "calculus", "algebra", "discrete");
        }

        // 5. Direct search by title or author keywords
        List<Book> directMatches = findDirectMatches(userMessage, allBooks);
        if (!directMatches.isEmpty()) {
            StringBuilder sb = new StringBuilder("🔍 **Matching Books Found in Catalog:**\n\n");
            for (Book b : directMatches) {
                sb.append(String.format("• **%s** by %s\n  - Category: *%s*\n  - Status: %s\n\n",
                        b.getTitle(), b.getAuthor(), b.getCategory(), b.isAvailable() ? "✅ Available to Borrow" : "❌ Currently Checked Out"));
            }
            return new ChatResponse(sb.toString(), "smart-assistant", false);
        }

        // 6. Helpful General Guidance
        return new ChatResponse(
                "I couldn't find a direct match for *\"" + escapeMarkdown(userMessage) + "\"* in our current catalog.\n\n" +
                "💡 **Try asking:**\n" +
                "• *\"Which programming books are available?\"*\n" +
                "• *\"Show all database books\"*\n" +
                "• *\"List available books\"*\n" +
                "• *\"How do I borrow a book?\"*\n\n" +
                "You can also use the **Search Bar** in the Catalog view to filter by title, author, or ISBN.",
                "smart-assistant",
                false
        );
    }

    private boolean matchesAny(String input, String... keywords) {
        for (String kw : keywords) {
            if (input.contains(kw)) {
                return true;
            }
        }
        return false;
    }

    private ChatResponse buildTopicResponse(String topicName, List<Book> allBooks, String... terms) {
        List<Book> matched = allBooks.stream().filter(b -> {
            for (String t : terms) {
                if ((b.getTitle() != null && b.getTitle().toLowerCase(Locale.ROOT).contains(t)) ||
                    (b.getCategory() != null && b.getCategory().toLowerCase(Locale.ROOT).contains(t))) {
                    return true;
                }
            }
            return false;
        }).collect(Collectors.toList());

        StringBuilder sb = new StringBuilder();
        sb.append("📚 **Recommended Books for ").append(topicName).append(":**\n\n");

        if (matched.isEmpty()) {
            sb.append("We don't have titles specifically tagged under this topic in our current catalog yet.\n\n")
              .append("💡 *Tip: Check our complete catalog or ask a librarian to request new additions for this subject!*");
        } else {
            for (Book b : matched) {
                sb.append(String.format("• **%s** by %s\n  - Category: *%s*\n  - Status: %s\n\n",
                        b.getTitle(),
                        b.getAuthor(),
                        b.getCategory(),
                        b.isAvailable() ? "✅ Available" : "❌ Checked Out"));
            }
            sb.append("👉 Visit the **Catalog** tab to issue or view more details.");
        }

        return new ChatResponse(sb.toString(), "smart-assistant", false);
    }

    private List<Book> findDirectMatches(String query, List<Book> allBooks) {
        String clean = query.toLowerCase(Locale.ROOT).trim();
        List<Book> results = new ArrayList<>();
        for (Book b : allBooks) {
            String title = b.getTitle() != null ? b.getTitle().toLowerCase(Locale.ROOT) : "";
            String author = b.getAuthor() != null ? b.getAuthor().toLowerCase(Locale.ROOT) : "";
            String cat = b.getCategory() != null ? b.getCategory().toLowerCase(Locale.ROOT) : "";

            if (title.contains(clean) || author.contains(clean) || cat.contains(clean)) {
                results.add(b);
            }
        }
        return results;
    }

    private String escapeMarkdown(String str) {
        if (str == null) return "";
        return str.replace("*", "").replace("_", "");
    }
}
