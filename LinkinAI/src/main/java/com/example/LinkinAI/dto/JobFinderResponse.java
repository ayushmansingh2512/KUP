package com.example.LinkinAI.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class JobFinderResponse {
	private String searchSummary;
	private List<JobItem> jobs;
	private String linkedinSearchUrl;
	private String googleJobsUrl;
	private String indeedSearchUrl;
	private String naukriSearchUrl;
	private String glassdoorSearchUrl;

	@Data
	@AllArgsConstructor
	@NoArgsConstructor
	@JsonIgnoreProperties(ignoreUnknown = true)
	public static class JobItem {
		private String jobTitle;
		private String companyName;
		private String location;
		private String jobType;
		private String salaryRange;
		private String matchScore;
		private List<String> keyRequirements;
		private String recruiterSearchTerm;
		private String applySearchUrl;
	}
}
