package com.smartlibrary.backend.service;

import com.smartlibrary.backend.dto.BookRequest;
import com.smartlibrary.backend.dto.BookResponse;
import com.smartlibrary.backend.dto.LibraryStatsResponse;

import java.util.List;

public interface BookService {

    List<BookResponse> getBooks(String query, String category, Boolean available);

    BookResponse getBookById(Long id);

    BookResponse createBook(BookRequest request);

    BookResponse updateBook(Long id, BookRequest request);

    void deleteBook(Long id);

    LibraryStatsResponse getLibraryStats();

    List<String> getCategories();
}
