package com.example.LinkinAI;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class KeepAliveService {

    @Value("${app.public-url:}")
    private String publicUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    // Run every 12 minutes (720,000 milliseconds) to prevent Render scale-to-zero
    @Scheduled(fixedRate = 720000)
    public void pingSelf() {
        if (publicUrl != null && !publicUrl.trim().isEmpty()) {
            try {
                String pingUrl = publicUrl.trim();
                if (!pingUrl.endsWith("/")) {
                    pingUrl += "/";
                }
                pingUrl += "api/v1/linkin/ping";
                restTemplate.getForObject(pingUrl, String.class);
            } catch (Exception e) {
                System.err.println("[KeepAlive] Failed to ping self: " + e.getMessage());
            }
        }
    }
}
