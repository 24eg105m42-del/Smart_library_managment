package com.smartlibrary.backend;

import com.smartlibrary.backend.dto.BookRequest;
import com.smartlibrary.backend.dto.BookResponse;
import com.smartlibrary.backend.exception.ResourceNotFoundException;
import com.smartlibrary.backend.service.BookService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class BookControllerTest {

    @Autowired
    private BookService bookService;

    @Test
    void testGetBooksAndStats() {
        List<BookResponse> books = bookService.getBooks(null, null, null);
        assertNotNull(books);
        assertFalse(books.isEmpty(), "DataInitializer should have seeded books");

        var stats = bookService.getLibraryStats();
        assertNotNull(stats);
        assertTrue(stats.getTotalBooks() > 0);
        assertTrue(stats.getAvailableBooks() > 0);
    }

    @Test
    void testSearchAndFilter() {
        List<BookResponse> javaBooks = bookService.getBooks("Java", null, null);
        assertNotNull(javaBooks);
        assertFalse(javaBooks.isEmpty());
        assertTrue(javaBooks.stream().anyMatch(b -> b.getTitle().contains("Java")));

        List<BookResponse> availableBooks = bookService.getBooks(null, null, true);
        assertNotNull(availableBooks);
        assertTrue(availableBooks.stream().allMatch(BookResponse::isAvailable));
    }

    @Test
    void testCreateUpdateDeleteBook() {
        BookRequest newBook = new BookRequest("Clean Architecture", "Robert C. Martin", "Software Engineering", true, "978-0134494166", "A craftsman guide");
        BookResponse created = bookService.createBook(newBook);
        assertNotNull(created.getId());
        assertEquals("Clean Architecture", created.getTitle());

        BookRequest updateReq = new BookRequest("Clean Architecture (Updated)", "Robert C. Martin", "Software Engineering", false);
        BookResponse updated = bookService.updateBook(created.getId(), updateReq);
        assertEquals("Clean Architecture (Updated)", updated.getTitle());
        assertFalse(updated.isAvailable());

        bookService.deleteBook(created.getId());
        assertThrows(ResourceNotFoundException.class, () -> bookService.getBookById(created.getId()));
    }

    @Test
    void testGetBookNotFoundThrows404() {
        assertThrows(ResourceNotFoundException.class, () -> bookService.getBookById(999999L));
    }
}
