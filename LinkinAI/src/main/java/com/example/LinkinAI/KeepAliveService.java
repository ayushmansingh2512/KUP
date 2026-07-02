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

    // Run every 12 minutes (720,000 milliseconds) to prevent Hugging Face Space scale-to-zero/sleep
    @Scheduled(fixedRate = 720000)
    public void pingSelf() {
        String targetUrl = publicUrl;

        // Fallback 1: Hugging Face Spaces default environment variable
        if (targetUrl == null || targetUrl.trim().isEmpty()) {
            String spaceHost = System.getenv("SPACE_HOST");
            if (spaceHost != null && !spaceHost.trim().isEmpty()) {
                targetUrl = "https://" + spaceHost.trim();
            }
        }

        // Fallback 2: General APP_URL or SELF_PING_URL environment variables
        if (targetUrl == null || targetUrl.trim().isEmpty()) {
            String appUrl = System.getenv("APP_URL");
            if (appUrl != null && !appUrl.trim().isEmpty()) {
                targetUrl = appUrl;
            } else {
                String selfPingUrl = System.getenv("SELF_PING_URL");
                if (selfPingUrl != null && !selfPingUrl.trim().isEmpty()) {
                    targetUrl = selfPingUrl;
                }
            }
        }

        if (targetUrl != null && !targetUrl.trim().isEmpty()) {
            try {
                String pingUrl = targetUrl.trim();
                if (!pingUrl.endsWith("/")) {
                    pingUrl += "/";
                }
                pingUrl += "api/v1/linkin/ping";
                System.out.println("[KeepAlive] Pinging self at: " + pingUrl);
                String response = restTemplate.getForObject(pingUrl, String.class);
                System.out.println("[KeepAlive] Ping successful! Response: " + response);
            } catch (Exception e) {
                System.err.println("[KeepAlive] Failed to ping self at " + targetUrl + ": " + e.getMessage());
            }
        } else {
            System.out.println("[KeepAlive] No public URL or SPACE_HOST configured. Skipping self-ping.");
        }
    }
}

