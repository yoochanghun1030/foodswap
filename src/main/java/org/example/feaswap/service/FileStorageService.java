package org.example.feaswap.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path rootLocation = Paths.get("uploads");

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for uploads!", e);
        }
    }

    public String store(MultipartFile file) {
        String original = file.getOriginalFilename();
        String filename = UUID.randomUUID() + "_" + (original != null ? original : "unknown");

        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file " + filename);
            }
            Path destinationFile = rootLocation
                    .resolve(filename)
                    .normalize().toAbsolutePath();
            try (InputStream in = file.getInputStream()) {
                Files.copy(in, destinationFile);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + filename, e);
        }

        return ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/uploads/")
                .path(filename)
                .toUriString();
    }
}
