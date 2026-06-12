package com.example.LinkinAI;

import com.example.LinkinAI.dto.LinkedInProfileRequest;
import com.example.LinkinAI.dto.LinkedInProfileResponse;
import com.example.LinkinAI.dto.LinkedInOutreachRequest;
import com.example.LinkinAI.dto.LinkedInOutreachResponse;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * Now we will be wokring on rest controller basically GET POST UPDATE DELETE
 * This program will only have POST and GET
 * Basically it yeh data bridge isski mada sae humlog Gemini sae data lenge or
 * denge
 */

@RestController
@RequestMapping("/api/v1/linkin")
@CrossOrigin(origins = "*") // yeh connect karta hae tumare react app ko uske port ki madad sae * matlab har
							// port pae chalega
public class LinkedInController {
	// Spring AI 2.x utilizes a fluent, thread-safe ChatClient interface for model
	// interaction
	private final ChatClient chatClient;
	private final ImageGenerationService imageService;

	/**
	 * Constructer Injection Spring boot automatically inkjects the auto-Configured
	 * ChatClient.Builder based on Your Started Dependecy and application.yml sett
	 */

	public LinkedInController(ChatClient.Builder chatClientBuilder, ImageGenerationService imageService) {
		this.chatClient = chatClientBuilder.build();
		this.imageService = imageService;
	}

	@GetMapping("/ping")
	public ResponseEntity<String> ping() {
		return ResponseEntity.ok("pong");
	}

	/**
	 * POST EndPoint to genrate optimized profile text.
	 * Takes a json payload , orchestrates the AI Prompt , and return a strucher
	 **/

	@PostMapping(value = "/genrate", consumes = "application/json", produces = "application/json")
	public ResponseEntity<LinkedInProfileResponse> genrateContent(@RequestBody LinkedInProfileRequest request) {
		String systemPrompt = """
				    You are an elite, world-class technical copywriter and profile optimization expert.
				    Your task is to analyze the incoming details (which may include career details, skills, experience, or project details) and generate professional LinkedIn content.

				    CRITICAL OUTPUT CONSTRAINTS:
				    1. The 'headline' field MUST be a highly punchy, professional LinkedIn headline (strictly under 180 characters).
				    2. The 'bio' field MUST be an engaging LinkedIn Bio / Profile Summary (About section) summarizing their professional profile, core strengths, and value proposition (strictly under 450 characters).
				    3. The 'projectSummary' field MUST be a structurally sound summary of the project details described in the input (strictly under 450 characters). If no specific project is described in the input, provide a brief template summary of a project relevant to their role.
				""";
		StringBuilder detailsBuilder = new StringBuilder();
		if (request.getTargetAudience() != null && !request.getTargetAudience().trim().isEmpty() && !request.getTargetAudience().equalsIgnoreCase("General")) {
			detailsBuilder.append("Target Audience: ").append(request.getTargetAudience()).append("\n");
		}
		if (request.getProjectName() != null && !request.getProjectName().trim().isEmpty()) {
			detailsBuilder.append("Project Name: ").append(request.getProjectName()).append("\n");
		}
		detailsBuilder.append("Details: ").append(request.getRawProjectText());
		String details = detailsBuilder.toString();

		LinkedInProfileResponse structuredOutput = chatClient.prompt()
				.system(systemPrompt)
				.user(details)
				.call()
				.entity(new ParameterizedTypeReference<LinkedInProfileResponse>() {
				});// this need an empty structure for initalization

		return ResponseEntity.ok(structuredOutput);

	}

	@PostMapping(value = "/generate-outreach", consumes = "application/json", produces = "application/json")
	public ResponseEntity<LinkedInOutreachResponse> generateOutreach(@RequestBody LinkedInOutreachRequest request) {
		String systemPrompt = """
				    You are an elite, world-class career coach and professional networking expert.
				    Your task is to draft a highly effective networking/cold outreach message (LinkedIn message, InMail, Connection invite note, or Email) for a university student.
				    
				    CRITICAL OUTPUT CONSTRAINTS:
				    1. The 'subjectLine' field MUST be a highly professional, click-worthy email subject line (strictly under 75 characters). For non-email mediums (like LinkedIn InMail or Connection Notes), return null or empty.
				    2. The 'body' field MUST contain the outreach message body:
				       - Tailored to the recipient's role (Recruiter, Alumnus, Hiring Manager, or Tech Lead) and target company.
				       - Highlight relevant key points from the student's profile summary and context.
				       - For LinkedIn Connection notes, strictly constraint the length to under 300 characters (including placeholders/salutations).
				       - For other mediums, keep it strictly under 600 characters—concise, clear, and showing dynamic interest.
				       - Avoid generic cliches, sound natural, warm, and highly professional.
				    3. The 'tips' field MUST provide 2-3 strategic networking tips for this specific combination of recipient, medium, and tone (strictly under 350 characters total).
				""";

		StringBuilder detailsBuilder = new StringBuilder();
		detailsBuilder.append("Student Profile: ").append(request.getStudentProfile()).append("\n");
		detailsBuilder.append("Recipient Role: ").append(request.getRecipientRole()).append("\n");
		detailsBuilder.append("Target Company: ").append(request.getCompanyName()).append("\n");
		if (request.getJobContext() != null && !request.getJobContext().trim().isEmpty()) {
			detailsBuilder.append("Job/Context details: ").append(request.getJobContext()).append("\n");
		}
		detailsBuilder.append("Tone: ").append(request.getTone()).append("\n");
		detailsBuilder.append("Medium: ").append(request.getMedium()).append("\n");

		LinkedInOutreachResponse structuredOutput = chatClient.prompt()
				.system(systemPrompt)
				.user(detailsBuilder.toString())
				.call()
				.entity(new ParameterizedTypeReference<LinkedInOutreachResponse>() {
				});

		return ResponseEntity.ok(structuredOutput);
	}

	/**
	 * Direct image generator stream that accepts custom background parameter maps
	 * dynamically.
	 * Passes the parsed Gemini response along with the chosen templateName directly
	 * to the OpenCV processing engine.
	 */
	/**
	 * High-performance Multipart Endpoint to generate optimized branding banners.
	 * Compiles project metadata details from Gemini and fuses the raw uploaded PFP
	 * image matrix on-the-fly.
	 */
	@PostMapping(value = "/generate-banner", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> generateBannerImage(
			@RequestParam(value = "all", required = false, defaultValue = "false") boolean all,
			@RequestPart(value = "request", required = false) String requestJson,
			@RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
			@RequestPart(value = "backgroundImage", required = false) MultipartFile backgroundImage) throws IOException {

		// 1. Generate all versions using our OpenCV logic
		java.util.Map<String, byte[]> imagesMap = imageService.generateAllProfilePictures(profileImage, backgroundImage);

		if (all) {
			// Convert raw byte arrays into Base64 Data URIs for frontend rendering
			java.util.Map<String, String> results = new java.util.HashMap<>();
			for (java.util.Map.Entry<String, byte[]> entry : imagesMap.entrySet()) {
				String base64 = java.util.Base64.getEncoder().encodeToString(entry.getValue());
				String dataUri = "data:image/png;base64," + base64;
				results.put(entry.getKey(), dataUri);
			}
			return ResponseEntity.ok()
					.contentType(MediaType.APPLICATION_JSON)
					.body(results);
		} else {
			// If a custom background was uploaded, return that specific PFP
			if (backgroundImage != null && !backgroundImage.isEmpty() && imagesMap.containsKey("custom")) {
				return ResponseEntity.ok()
						.contentType(MediaType.IMAGE_PNG)
						.body(imagesMap.get("custom"));
			}

			// Check if a specific template name was explicitly requested (other than default "office")
			String templateName = null;
			if (requestJson != null && !requestJson.trim().isEmpty()) {
				com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();
				try {
					LinkedInProfileRequest request = objectMapper.readValue(requestJson, LinkedInProfileRequest.class);
					if (request.getTemplateName() != null && !request.getTemplateName().trim().isEmpty()) {
						templateName = request.getTemplateName();
					}
				} catch (Exception e) {
					// Ignore
				}
			}

			if (templateName != null && !templateName.equals("office") && imagesMap.containsKey(templateName)) {
				return ResponseEntity.ok()
						.contentType(MediaType.IMAGE_PNG)
						.body(imagesMap.get(templateName));
			}

			// Default: Return the 2x2 grid containing all 4 templates!
			byte[] gridBytes = imageService.generateProfilePicturesGrid(imagesMap);
			return ResponseEntity.ok()
					.contentType(MediaType.IMAGE_PNG)
					.body(gridBytes);
		}
	}

	/**
	 * Extracts the person from the uploaded image using background removal (rembg).
	 * Returns an RGBA PNG as a base64 data URI so the frontend can do live canvas compositing.
	 */
	@PostMapping(value = "/extract-person", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> extractPerson(
			@RequestPart("profileImage") MultipartFile profileImage) throws IOException {
		byte[] rgbaBytes = imageService.extractPersonRGBA(profileImage);
		String base64 = java.util.Base64.getEncoder().encodeToString(rgbaBytes);
		java.util.Map<String, String> result = new java.util.HashMap<>();
		result.put("personImage", "data:image/png;base64," + base64);
		return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(result);
	}

}
