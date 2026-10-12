package com.smartlibrary.backend.config;

import com.smartlibrary.backend.model.Book;
import com.smartlibrary.backend.model.User;
import com.smartlibrary.backend.repository.BookRepository;
import com.smartlibrary.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

@Configuration
public class DataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    public CommandLineRunner initData(
            DataSource dataSource,
            UserRepository userRepository,
            BookRepository bookRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // Ensure any legacy non-null columns in MySQL are relaxed so inserts don't fail
            try (Connection conn = dataSource.getConnection();
                 Statement stmt = conn.createStatement()) {
                try {
                    stmt.execute("ALTER TABLE users MODIFY COLUMN full_name VARCHAR(255) NULL");
                } catch (Exception ignored) {
                }
                try {
                    stmt.execute("ALTER TABLE users MODIFY COLUMN mobile VARCHAR(255) NULL");
                } catch (Exception ignored) {
                }
                try {
                    stmt.execute("ALTER TABLE users DROP INDEX UK63cf888pmqtt5tipcne79xsbm");
                } catch (Exception ignored) {
                }
            } catch (Exception e) {
                logger.warn("Database schema check notice: {}", e.getMessage());
            }

            // Seed initial users if empty
            try {
                if (userRepository.count() == 0) {
                    logger.info("Seeding initial users...");

                    User student = new User(
                            null,
                            "Sathwik",
                            "sathwik@gmail.com",
                            passwordEncoder.encode("1234"),
                            "STUDENT"
                    );
                    userRepository.save(student);

                    User admin = new User(
                            null,
                            "Library Administrator",
                            "admin@smartlibrary.com",
                            passwordEncoder.encode("admin123"),
                            "ADMIN"
                    );
                    userRepository.save(admin);

                    logger.info("Default student (sathwik@gmail.com / 1234) and admin (admin@smartlibrary.com / admin123) created.");
                }
            } catch (Exception e) {
                logger.warn("Seeding initial users skipped: {}", e.getMessage());
            }

            // Seed initial books if empty
            try {
                if (bookRepository.count() == 0) {
                    logger.info("Seeding initial book catalog...");

                    bookRepository.save(new Book(
                            null,
                            "Java: The Complete Reference",
                            "Herbert Schildt",
                            "Programming",
                            true,
                            "978-1260440232",
                            "A comprehensive guide to the Java language, standard libraries, and modern features."
                    ));

                    bookRepository.save(new Book(
                            null,
                            "Database System Concepts",
                            "Abraham Silberschatz",
                            "Database",
                            true,
                            "978-0078022159",
                            "Fundamental concepts of database management, SQL, relational models, and transactions."
                    ));

                    bookRepository.save(new Book(
                            null,
                            "Computer Networks",
                            "Andrew S. Tanenbaum",
                            "Networking",
                            true,
                            "978-0132126953",
                            "The definitive guide to networking layers, protocols, architecture, and network security."
                    ));

                    bookRepository.save(new Book(
                            null,
                            "Artificial Intelligence: A Modern Approach",
                            "Stuart Russell & Peter Norvig",
                            "AI",
                            true,
                            "978-0136042594",
                            "The leading textbook in AI covering search, logic, probabilistic reasoning, and machine learning."
                    ));

                    bookRepository.save(new Book(
                            null,
                            "Introduction to Algorithms (CLRS)",
                            "Thomas H. Cormen",
                            "Algorithms",
                            false,
                            "978-0262033848",
                            "Standard reference for algorithms and data structures, analysis, and algorithm design."
                    ));

                    bookRepository.save(new Book(
                            null,
                            "Clean Code: A Handbook of Agile Software Craftsmanship",
                            "Robert C. Martin",
                            "Programming",
                            true,
                            "978-0132350884",
                            "Best practices and principles for writing readable, maintainable, and robust code."
                    ));

                    bookRepository.save(new Book(
                            null,
                            "Designing Data-Intensive Applications",
                            "Martin Kleppmann",
                            "Database",
                            true,
                            "978-1449373320",
                            "Key principles for building scalable, reliable, and maintainable data systems."
                    ));

                    logger.info("Seeded 7 catalog books successfully.");
                }
            } catch (Exception e) {
                logger.warn("Seeding initial books skipped: {}", e.getMessage());
            }
        };
    }
}
