package com.github.connect.dto.internal;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class NotionDatabaseResponse {
    private String id;
    private String object;
    
    @JsonProperty("data_sources")
    private List<DataSource> dataSources;

    @Getter @Setter @NoArgsConstructor
    public static class DataSource {
        private String id; // data_source_id
        private String name;
    }
}
