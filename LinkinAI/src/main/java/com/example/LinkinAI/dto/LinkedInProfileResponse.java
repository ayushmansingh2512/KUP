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
public class LinkedInProfileResponse {
    private String headline;
    private String bio;
    private String projectSummary;    
    private List<String> headlines;
    private List<String> bios;

    public void setOptions(List<String> options) {
        this.headlines = options;
    }
}
