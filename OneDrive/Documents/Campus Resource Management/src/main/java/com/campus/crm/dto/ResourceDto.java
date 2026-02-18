package com.campus.crm.dto;

import com.campus.crm.model.Resource;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResourceDto {
    private Long id;
    private String name;
    private Resource.ResourceType type;
    private int capacity;
    private String location;
    private String description;
    private Resource.ResourceStatus status;

    public static ResourceDto fromEntity(Resource resource) {
        return ResourceDto.builder()
                .id(resource.getId())
                .name(resource.getName())
                .type(resource.getType())
                .capacity(resource.getCapacity())
                .location(resource.getLocation())
                .description(resource.getDescription())
                .status(resource.getStatus())
                .build();
    }
}
