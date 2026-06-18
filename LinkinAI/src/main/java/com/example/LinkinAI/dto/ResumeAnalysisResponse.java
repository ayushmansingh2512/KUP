package com.example.LinkinAI.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResumeAnalysisResponse {
    private List<String> headlines;
    private List<String> bios;
    private List<String> suggestions;
}
