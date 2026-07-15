package com.swastikai.medassist.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class WebSearchService {

    private final RestClient restClient;
    private final String apiKey;

    public WebSearchService(RestClient.Builder builder, @Value("${tavily.api-key}") String apiKey) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("tavily.api-key must be configured for production deployments.");
        }
        this.apiKey = apiKey;
        this.restClient = builder.baseUrl("https://api.tavily.com").build();
    }

    public record TavilyResult(String title, String url, String content, Double score) {}
    public record TavilySearchResponse(String query, String answer, List<TavilyResult> results) {}

    public TavilySearchResponse search(String query, int maxResults) {
        return restClient.post()
                .uri("/search")
                .header("Authorization", "Bearer " + apiKey)
                .body(Map.of(
                        "query", query,
                        "max_results", maxResults,
                        "include_answer", "basic"
                ))
                .retrieve()
                .body(TavilySearchResponse.class);
    }
}