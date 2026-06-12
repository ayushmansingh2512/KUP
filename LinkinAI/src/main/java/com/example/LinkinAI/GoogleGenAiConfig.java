package com.example.LinkinAI;

import com.google.genai.Client;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
public class GoogleGenAiConfig {

	@Bean
	public Client customGoogleGenAiClient(Environment environment) {
		String apiKey = environment.getProperty("spring.ai.google.genai.api-key");
		// Fallback to a placeholder if the key is not configured, allowing application startup
		String key = (apiKey == null || apiKey.trim().isEmpty()) ? "placeholder-key" : apiKey;
		return Client.builder()
				.apiKey(key)
				.build();
	}
}
