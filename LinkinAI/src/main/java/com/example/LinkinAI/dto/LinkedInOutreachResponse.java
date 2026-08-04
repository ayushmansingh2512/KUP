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
public class LinkedInOutreachResponse {
	private String subjectLine;
	private String body;
	private String tips;
	private String followUpMessage;
	private List<String> networkingTips;

	public void setNetworkingTips(List<String> networkingTips) {
		this.networkingTips = networkingTips;
		if (networkingTips != null && !networkingTips.isEmpty()) {
			this.tips = String.join("\n", networkingTips);
		}
	}
}
