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
public class NetworkRecommendationResponse {
    private String summary;
    private List<String> recommendedRoles;
    private List<LeaderItem> thoughtLeaders;
    private List<CompanyItem> topCompanies;
    private String networkingTip;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class LeaderItem {
        private String name;
        private String titleRole;
        private String reasonToFollow;
        private String searchUrl;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CompanyItem {
        private String companyName;
        private String domainTagline;
        private String searchUrl;
    }
}
