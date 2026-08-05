package com.example.LinkinAI.dto;

import lombok.Data;

@Data
public class LinkedInPostRequest {
    private String achievementDetails;
    private String tone; // e.g. Storytelling, Educational, Announcement, Minimalist
    private String targetAudience; // e.g. Recruiters, Tech Peers, General
}
