package com.example.LinkinAI.dto;

import lombok.Data;

@Data
public class JobFinderRequest {
	private String jobTitle;
	private String experienceLevel;
	private String skills;
	private String location;
	private String jobType;
	private String targetCompany;
}
