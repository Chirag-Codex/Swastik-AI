package com.swastikai.medassist.controller;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.swastikai.medassist.dto.ChatRequest;
import com.swastikai.medassist.dto.ChatResponse;
import com.swastikai.medassist.service.AiService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/assistant")
@RequiredArgsConstructor
public class AiAssistantController {

    private static final Logger logger = LoggerFactory.getLogger(AiAssistantController.class);
    private final AiService aiService;

    /**
     * Text-only chat endpoint (existing)
     */
    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@AuthenticationPrincipal String userEmail,
                                             @Valid @RequestBody ChatRequest request) {
        logger.info("Text chat request from user: {}", userEmail);
        String reply = aiService.chat(userEmail, request.getMessage());
        return ResponseEntity.ok(new ChatResponse(reply));
    }

    @PostMapping(value = "/chat/media", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ChatResponse> chatWithMedia(
            @AuthenticationPrincipal String userEmail,
            @RequestParam(value = "message", required = false) String message,
            @RequestParam("file") MultipartFile file) {

        logger.info("Media chat request from user: {}, file: {}, size: {} bytes",
                userEmail, file.getOriginalFilename(), file.getSize());

        try {
           
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(
                        new ChatResponse("Error: File is empty. Please upload a valid image or audio file.")
                );
            }

          
            String reply = aiService.chatWithMedia(userEmail, message, file);
            return ResponseEntity.ok(new ChatResponse(reply));

        } catch (IllegalArgumentException | IllegalStateException e) {
            logger.warn("Invalid media request from user {}: {}", userEmail, e.getMessage());
            return ResponseEntity.badRequest().body(
                    new ChatResponse("Error: " + e.getMessage())
            );
        } catch (Exception e) {
            logger.error("Error processing media chat for user {}: {}", userEmail, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ChatResponse("Error processing media: " + e.getMessage())
            );
        }
    }

    @PostMapping("/ping")
    public ResponseEntity<Map<String, String>> ping() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Swastik AI Assistant is running");
        return ResponseEntity.ok(response);
    }
}