package com.swastikai.medassist.service;

import java.io.IOException;
import java.util.NoSuchElementException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeType;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.multipart.MultipartFile;

import com.swastikai.medassist.util.MediaTypeValidator;

@Service
public class AiService {

    private static final Logger logger = LoggerFactory.getLogger(AiService.class);
    private final ChatClient chatClient;
    private final MediaTypeValidator mediaTypeValidator;
    private final AudioConversionService audioConversionService;

    public AiService(ChatClient chatClient, MediaTypeValidator mediaTypeValidator,
                     AudioConversionService audioConversionService) {
        this.chatClient = chatClient;
        this.mediaTypeValidator = mediaTypeValidator;
        this.audioConversionService = audioConversionService;
    }


    public String chat(String userId, String message) {
        logger.info("Processing text chat for user: {}", userId);
        return chatClient.prompt()
                .user(message)
                .advisors(advisorSpec -> advisorSpec.param(ChatMemory.CONVERSATION_ID, userId))
                .call()
                .content();
    }
  
    public String chatWithMedia(String userId, String message, MultipartFile mediaFile) throws IOException {
        logger.info("Processing media chat for user: {}, file: {}, size: {} bytes, type: {}",
                userId, mediaFile.getOriginalFilename(), mediaFile.getSize(), mediaFile.getContentType());

       
        mediaTypeValidator.validateMediaFile(mediaFile);

        String contentType = mediaFile.getContentType();
        String fileType = mediaTypeValidator.getFileTypeDescription(mediaFile);

        logger.debug("Validated file: {}, type: {}", mediaFile.getOriginalFilename(), fileType);

        byte[] fileBytes = mediaFile.getBytes();
        MimeType mimeType = MimeTypeUtils.parseMimeType(contentType);

        if (mediaTypeValidator.isAudioType(contentType) && !mediaTypeValidator.isGeminiNativeAudioType(contentType)) {
            logger.info("Audio type {} isn't natively supported by Gemini — converting to WAV for user {}",
                    contentType, userId);
            try {
                fileBytes = audioConversionService.convertToWav(fileBytes);
                mimeType = MimeTypeUtils.parseMimeType("audio/wav");
            } catch (IOException e) {
                logger.error("Audio conversion failed for user {}: {}", userId, e.getMessage(), e);
                throw new IllegalArgumentException(
                        "Could not process this audio format. Please try recording again.");
            }
        }

        final byte[] mediaBytes = fileBytes;
        Resource resource = new ByteArrayResource(mediaBytes) {
            @Override
            public String getFilename() {
                return mediaFile.getOriginalFilename();
            }
        };

     
        String userText = (message == null || message.isBlank())
                ? "Please look at the attached " + fileType.toLowerCase() + " and help me."
                : message;

        logger.debug("Calling Gemini with media: {}, message: {}", mediaFile.getOriginalFilename(), userText);

        try {
          
            MimeType finalMimeType = mimeType;
            String response = chatClient.prompt()
                    .user(u -> u.text(userText).media(finalMimeType, resource))
                    .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, userId))
                    .call()
                    .content();

            logger.info("Media chat completed for user: {}, response length: {}", userId, response.length());
            return response;
        } catch (NoSuchElementException e) {
           
            logger.error("Gemini returned an empty/blocked response for user {} (file type: {}): {}",
                    userId, contentType, e.getMessage());
            throw new IllegalStateException(
                    "The AI couldn't process this file — it may have been blocked or the format isn't supported. Please try a different file.");
        }
    }
}