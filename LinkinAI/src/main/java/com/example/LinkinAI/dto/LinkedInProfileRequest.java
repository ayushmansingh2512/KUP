package com.example.LinkinAI.dto;

import lombok.Data;

/**
 * Inbound data transfer object acting as a stateless data bridge
 * this class catches the raw json fromat payload and dispatched from the react
 * Type script
 * frontend and maps it directly into JVM memory for processing
 **/

@Data // Yeh Automatically genrate the getter , setter , toString , equals and other
		// stuff so you dont need to write the bler plate code
public class LinkedInProfileRequest {

	/**
	 * yeh file baiscally react sae connected hae or uske directly har message send
	 * karegi
	 * This forms the primary corpus that will be read and parsed by the Gemini AI
	 * engine.
	 **/

	private String rawProjectText;

	/**
	 * The designated professional segment you want to target (e.g., "Recruiters",
	 * "Founders").
	 * This field dynamically shifts the structural context inside the AI system
	 * prompt.
	 **/

	private String targetAudience;

	/**
	 * Yeh select karega ki backgrounds folder sae kaunsi image templates download
	 * karni hae
	 * Pass the filename string from frontend (e.g., "tech-dark", "modern-gradient")
	 * without ".png" extension
	 **/

	private String templateName;

	private String projectName;

}
