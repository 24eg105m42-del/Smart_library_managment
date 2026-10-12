package com.smartlibrary.backend.repository;

import com.smartlibrary.backend.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findByCategoryIgnoreCase(String category);

    List<Book> findByAvailable(boolean available);

    List<Book> findByCategoryIgnoreCaseAndAvailable(String category, boolean available);

    long countByAvailable(boolean available);

    @Query("SELECT b FROM Book b WHERE " +
           "LOWER(b.title) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(b.category) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Book> searchBooks(@Param("q") String query);

    @Query("SELECT DISTINCT b.category FROM Book b WHERE b.category IS NOT NULL ORDER BY b.category")
    List<String> findDistinctCategories();
}
