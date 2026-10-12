package com.smartlibrary.backend.service;

import com.smartlibrary.backend.dto.BookRequest;
import com.smartlibrary.backend.dto.BookResponse;
import com.smartlibrary.backend.dto.LibraryStatsResponse;
import com.smartlibrary.backend.exception.ResourceNotFoundException;
import com.smartlibrary.backend.model.Book;
import com.smartlibrary.backend.repository.BookRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    public BookServiceImpl(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookResponse> getBooks(String query, String category, Boolean available) {
        List<Book> books;

        if (query != null && !query.trim().isEmpty()) {
            books = bookRepository.searchBooks(query.trim());
            if (category != null && !category.trim().isEmpty()) {
                books = books.stream()
                        .filter(b -> b.getCategory() != null && b.getCategory().equalsIgnoreCase(category.trim()))
                        .collect(Collectors.toList());
            }
            if (available != null) {
                books = books.stream()
                        .filter(b -> b.isAvailable() == available)
                        .collect(Collectors.toList());
            }
        } else if (category != null && !category.trim().isEmpty() && available != null) {
            books = bookRepository.findByCategoryIgnoreCaseAndAvailable(category.trim(), available);
        } else if (category != null && !category.trim().isEmpty()) {
            books = bookRepository.findByCategoryIgnoreCase(category.trim());
        } else if (available != null) {
            books = bookRepository.findByAvailable(available);
        } else {
            books = bookRepository.findAll();
        }

        return books.stream().map(BookResponse::new).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BookResponse getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + id));
        return new BookResponse(book);
    }

    @Override
    @Transactional
    public BookResponse createBook(BookRequest request) {
        Book book = new Book();
        book.setTitle(request.getTitle().trim());
        book.setAuthor(request.getAuthor().trim());
        book.setCategory(request.getCategory().trim());
        book.setAvailable(request.isAvailable());
        book.setIsbn(request.getIsbn() != null ? request.getIsbn().trim() : null);
        book.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);

        Book saved = bookRepository.save(book);
        return new BookResponse(saved);
    }

    @Override
    @Transactional
    public BookResponse updateBook(Long id, BookRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + id));

        book.setTitle(request.getTitle().trim());
        book.setAuthor(request.getAuthor().trim());
        book.setCategory(request.getCategory().trim());
        book.setAvailable(request.isAvailable());
        if (request.getIsbn() != null) {
            book.setIsbn(request.getIsbn().trim());
        }
        if (request.getDescription() != null) {
            book.setDescription(request.getDescription().trim());
        }

        Book updated = bookRepository.save(book);
        return new BookResponse(updated);
    }

    @Override
    @Transactional
    public void deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new ResourceNotFoundException("Book not found with ID: " + id);
        }
        bookRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public LibraryStatsResponse getLibraryStats() {
        long total = bookRepository.count();
        long available = bookRepository.countByAvailable(true);
        long borrowed = total - available;

        List<Book> allBooks = bookRepository.findAll();
        Map<String, Long> categoryBreakdown = new HashMap<>();
        for (Book b : allBooks) {
            String cat = b.getCategory() != null ? b.getCategory() : "Uncategorized";
            categoryBreakdown.put(cat, categoryBreakdown.getOrDefault(cat, 0L) + 1);
        }

        long totalCategories = categoryBreakdown.keySet().size();

        return new LibraryStatsResponse(total, available, borrowed, totalCategories, categoryBreakdown);
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getCategories() {
        return bookRepository.findDistinctCategories();
    }
}
