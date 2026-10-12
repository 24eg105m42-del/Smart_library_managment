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

@Configuration
public class DataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    public CommandLineRunner initData(
            UserRepository userRepository,
            BookRepository bookRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // Seed initial users if empty
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

            // Seed initial books if empty
            if (bookRepository.count() == 0) {
                logger.info("Seeding initial book catalog...");

                bookRepository.save(new Book(
                        null,
                        "Java: The Complete Reference",
                        "Herbert Schildt",
                        "Programming",
                        true,
                        "978-1260440232",
                        "Comprehensive guide to the Java language, syntax, libraries, and best programming practices."
                ));

                bookRepository.save(new Book(
                        null,
                        "Database System Concepts",
                        "Abraham Silberschatz",
                        "Database",
                        true,
                        "978-0078022159",
                        "Fundamental concepts of database management, relational algebra, SQL, and indexing."
                ));

                bookRepository.save(new Book(
                        null,
                        "Computer Networks",
                        "Andrew S. Tanenbaum",
                        "Networking",
                        false,
                        "978-0132126953",
                        "Classic reference on networking protocols, architectures from physical to application layer."
                ));

                bookRepository.save(new Book(
                        null,
                        "Artificial Intelligence: A Modern Approach",
                        "Stuart Russell & Peter Norvig",
                        "AI & Machine Learning",
                        true,
                        "978-0134610993",
                        "The leading textbook in AI covering search, reasoning, machine learning, and neural networks."
                ));

                bookRepository.save(new Book(
                        null,
                        "Clean Code",
                        "Robert C. Martin",
                        "Software Engineering",
                        true,
                        "978-0132350884",
                        "A handbook of agile software craftsmanship and patterns for writing maintainable software."
                ));

                bookRepository.save(new Book(
                        null,
                        "Designing Data-Intensive Applications",
                        "Martin Kleppmann",
                        "System Design",
                        true,
                        "978-1449373320",
                        "The definitive guide to the architecture of high-scale, reliable, and maintainable systems."
                ));

                bookRepository.save(new Book(
                        null,
                        "Introduction to Algorithms",
                        "Thomas H. Cormen",
                        "Algorithms",
                        false,
                        "978-0262033848",
                        "In-depth analysis of algorithms, data structures, complexity, and algorithmic design."
                ));

                logger.info("Seeded 7 catalog books successfully.");
            }
        };
    }
}
