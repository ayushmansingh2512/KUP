package com.example.LinkinAI;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = "spring.ai.google.genai.api-key=dummy-test-key")
class LinkinAiApplicationTests {

	@Test
	void contextLoads() {
		String[] templates = new String[]{"office", "tech-dark", "modern-gradient", "minimalist-blue"};
		for (String template : templates) {
			org.springframework.core.io.ClassPathResource r1 = new org.springframework.core.io.ClassPathResource("static/background/" + template + ".png");
			org.springframework.core.io.ClassPathResource r2 = new org.springframework.core.io.ClassPathResource("static/background/" + template + ".jpg");
			System.out.println("TEMPLATE: " + template + " | png exists: " + r1.exists() + " | jpg exists: " + r2.exists());
		}
	}
}
