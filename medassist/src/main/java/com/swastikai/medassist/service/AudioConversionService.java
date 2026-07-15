package com.swastikai.medassist.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import ws.schild.jave.Encoder;
import ws.schild.jave.EncoderException;
import ws.schild.jave.MultimediaObject;
import ws.schild.jave.encode.AudioAttributes;
import ws.schild.jave.encode.EncodingAttributes;

@Component
public class AudioConversionService {

    private static final Logger logger = LoggerFactory.getLogger(AudioConversionService.class);

    public byte[] convertToWav(byte[] inputBytes) throws IOException {
        File tempIn = File.createTempFile("medassist-audio-in-", ".tmp");
        File tempOut = File.createTempFile("medassist-audio-out-", ".wav");

        try {
            Files.write(tempIn.toPath(), inputBytes);

            AudioAttributes audioAttributes = new AudioAttributes();
            audioAttributes.setCodec("pcm_s16le");
            audioAttributes.setChannels(1);
            audioAttributes.setSamplingRate(16000);

            EncodingAttributes encodingAttributes = new EncodingAttributes();
            encodingAttributes.setOutputFormat("wav");
            encodingAttributes.setAudioAttributes(audioAttributes);

            Encoder encoder = new Encoder();
            encoder.encode(new MultimediaObject(tempIn), tempOut, encodingAttributes);

            byte[] wavBytes = Files.readAllBytes(tempOut.toPath());

            if (wavBytes.length == 0) {
                throw new IOException("Audio conversion produced no output");
            }

            logger.debug("Converted audio to WAV: {} bytes -> {} bytes", inputBytes.length, wavBytes.length);
            return wavBytes;

        } catch (EncoderException e) {
            logger.error("JAVE encoding failed: {}", e.getMessage(), e);
            throw new IOException("Audio conversion failed", e);
        } finally {
          
            if (!tempIn.delete()) {
                logger.warn("Could not delete temp input file: {}", tempIn.getAbsolutePath());
            }
            if (!tempOut.delete()) {
                logger.warn("Could not delete temp output file: {}", tempOut.getAbsolutePath());
            }
        }
    }
}