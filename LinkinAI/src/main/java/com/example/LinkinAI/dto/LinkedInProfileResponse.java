package com.example.LinkinAI.dto; 

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LinkedInProfileResponse {
    private String headline;
    private String bio;
    private String projectSummary;    
}
