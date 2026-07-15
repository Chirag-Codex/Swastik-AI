package com.swastikai.medassist.security;

public final class JwtConstant {
    public static final String JWT_HEADER = "Authorization";
    public static final String SECRET_KEY = resolveSecret();

    private JwtConstant() {}

    private static String resolveSecret() {
        String secret = System.getenv("JWT_SECRET");
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException("JWT_SECRET must be set as an environment variable for production deployments.");
        }
        return secret;
    }
}