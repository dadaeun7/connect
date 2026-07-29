package com.github.connect.dto.internal;

import java.util.List;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tools.jackson.databind.PropertyNamingStrategies;
import tools.jackson.databind.annotation.JsonNaming;

@Getter
@Setter
@NoArgsConstructor
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class FigmaHistoryResponse{

    private List<Version> versions;
    
    @Getter
    @Setter
    @NoArgsConstructor
    @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
    public static class Version {
        private String id;
        private String label;
        private String createdAt; // Activity createdAt;
        private String description; // Activity activityContent + 
        private FigmaUser user; // Activity activityContent
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
    public static class FigmaUser {
        private String handle;
    }
}
