package com.example.LinkinAI.dto;

import lombok.Data;

@Data
public class NetworkRecommendationRequest {
    private String targetIndustry;
    private String careerLevel; // e.g. Student / Fresher, Mid-Level, Senior, Career Switcher
}
