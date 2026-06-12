package com.example.LinkinAI.dto;

import lombok.Data;

@Data
public class LinkedInOutreachRequest {
	private String studentProfile;
	private String recipientRole;
	private String companyName;
	private String jobContext;
	private String tone;
	private String medium;
}
