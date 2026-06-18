package com.example.LinkinAI;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LinkinAiApplication {

	public static void main(String[] args) {
		SpringApplication.run(LinkinAiApplication.class, args);
	}

}


