package com.smartlibrary.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${app.cors.allowed-origins:https://smart-library-managment-sigma.vercel.app}")
    private String configuredOrigins;

    private List<String> getAllowedOriginsList() {
        List<String> origins = new ArrayList<>();
        // Explicitly allowed frontend deployments
        origins.add("https://smart-library-managment-sigma.vercel.app");
        origins.add("https://ai-smart-library-frontend.vercel.app");

        // Local development environments
        origins.add("http://localhost:5173");
        origins.add("http://localhost:5174");
        origins.add("http://localhost:5175");
        origins.add("http://localhost:5176");
        origins.add("http://localhost:3000");
        origins.add("http://localhost:4173");
        origins.add("http://127.0.0.1:5173");
        origins.add("http://127.0.0.1:5174");

        if (configuredOrigins != null && !configuredOrigins.isBlank()) {
            for (String origin : configuredOrigins.split(",")) {
                String trimmed = origin.trim();
                while (trimmed.endsWith("/")) {
                    trimmed = trimmed.substring(0, trimmed.length() - 1);
                }
                if (!trimmed.isEmpty() && !origins.contains(trimmed)) {
                    origins.add(trimmed);
                }
            }
        }
        return origins;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(getAllowedOriginsList().toArray(new String[0]))
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false)
                .maxAge(3600);
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        for (String origin : getAllowedOriginsList()) {
            config.addAllowedOrigin(origin);
        }
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");
        config.setAllowCredentials(false);
        config.setMaxAge(3600L);
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}