package com.smartlibrary.backend.dto;

import java.util.Map;

public class LibraryStatsResponse {

    private long totalBooks;
    private long availableBooks;
    private long borrowedBooks;
    private long totalCategories;
    private Map<String, Long> categoryBreakdown;

    public LibraryStatsResponse() {
    }

    public LibraryStatsResponse(long totalBooks, long availableBooks, long borrowedBooks, long totalCategories, Map<String, Long> categoryBreakdown) {
        this.totalBooks = totalBooks;
        this.availableBooks = availableBooks;
        this.borrowedBooks = borrowedBooks;
        this.totalCategories = totalCategories;
        this.categoryBreakdown = categoryBreakdown;
    }

    public long getTotalBooks() {
        return totalBooks;
    }

    public void setTotalBooks(long totalBooks) {
        this.totalBooks = totalBooks;
    }

    public long getAvailableBooks() {
        return availableBooks;
    }

    public void setAvailableBooks(long availableBooks) {
        this.availableBooks = availableBooks;
    }

    public long getBorrowedBooks() {
        return borrowedBooks;
    }

    public void setBorrowedBooks(long borrowedBooks) {
        this.borrowedBooks = borrowedBooks;
    }

    public long getTotalCategories() {
        return totalCategories;
    }

    public void setTotalCategories(long totalCategories) {
        this.totalCategories = totalCategories;
    }

    public Map<String, Long> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(Map<String, Long> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }
}
