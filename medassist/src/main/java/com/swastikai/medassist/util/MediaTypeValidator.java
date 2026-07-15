package com.swastikai.medassist.util;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class MediaTypeValidator {

    private static final Set<String> SUPPORTED_IMAGE_TYPES = new HashSet<>(Arrays.asList(
            "image/jpeg", "image/jpg", "image/png", "image/gif",
            "image/webp", "image/bmp", "image/tiff"
    ));

    private static final Set<String> SUPPORTED_AUDIO_TYPES = new HashSet<>(Arrays.asList(
            "audio/mpeg", "audio/mp3", "audio/wav", "audio/wave",
            "audio/x-wav", "audio/flac", "audio/ogg", "audio/aac",
            "audio/m4a", "audio/mp4", "audio/webm"
    ));

  
    private static final Set<String> GEMINI_NATIVE_AUDIO_TYPES = new HashSet<>(Arrays.asList(
            "audio/mpeg", "audio/mp3", "audio/wav", "audio/wave",
            "audio/x-wav", "audio/flac", "audio/ogg", "audio/aac"
    ));

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

   
    public void validateMediaFile(MultipartFile file) {
        if (file == null) {
            throw new IllegalArgumentException("File is required");
        }

        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty. Please upload a valid image or audio file.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                    String.format("File size exceeds %dMB limit. Current size: %.2fMB",
                            MAX_FILE_SIZE / (1024 * 1024),
                            file.getSize() / (1024.0 * 1024.0))
            );
        }

        String contentType = file.getContentType();
        if (contentType == null) {
            throw new IllegalArgumentException("Could not determine file type. Please ensure the file has a valid MIME type.");
        }

        if (!isSupportedContentType(contentType)) {
            throw new IllegalArgumentException(
                    String.format("Unsupported file type: %s. Supported types: Images (%s) and Audio (%s)",
                            contentType,
                            String.join(", ", SUPPORTED_IMAGE_TYPES),
                            String.join(", ", SUPPORTED_AUDIO_TYPES))
            );
        }
    }

   
    public boolean isSupportedContentType(String contentType) {
        if (contentType == null) {
            return false;
        }
        String lower = contentType.toLowerCase();
        return SUPPORTED_IMAGE_TYPES.contains(lower) || SUPPORTED_AUDIO_TYPES.contains(lower);
    }

    
    public boolean isImageType(String contentType) {
        if (contentType == null) {
            return false;
        }
        return SUPPORTED_IMAGE_TYPES.contains(contentType.toLowerCase());
    }

    public boolean isAudioType(String contentType) {
        if (contentType == null) {
            return false;
        }
        return SUPPORTED_AUDIO_TYPES.contains(contentType.toLowerCase());
    }

  
    public boolean isGeminiNativeAudioType(String contentType) {
        if (contentType == null) {
            return false;
        }
        return GEMINI_NATIVE_AUDIO_TYPES.contains(contentType.toLowerCase());
    }

   
    public String getFileTypeDescription(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null) {
            return "Unknown";
        }
        if (isImageType(contentType)) {
            return "Image (" + contentType + ")";
        } else if (isAudioType(contentType)) {
            return "Audio (" + contentType + ")";
        }
        return "Unsupported (" + contentType + ")";
    }
}