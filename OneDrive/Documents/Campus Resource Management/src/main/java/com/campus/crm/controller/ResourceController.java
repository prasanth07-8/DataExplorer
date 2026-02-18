package com.campus.crm.controller;

import com.campus.crm.common.ApiResponse;
import com.campus.crm.dto.ResourceDto;
import com.campus.crm.model.Resource;
import com.campus.crm.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ResourceDto>>> getAllResources(
            @RequestParam(value = "type", required = false) Resource.ResourceType type,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);

        if (type != null) {
            return ResponseEntity.ok(ApiResponse.success("Resources retrieved successfully",
                    resourceService.getResourcesByType(type, pageable)));
        }
        return ResponseEntity
                .ok(ApiResponse.success("Resources retrieved successfully",
                        resourceService.getAllResources(pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResourceDto>> getResourceById(@PathVariable Long id) {
        return ResponseEntity
                .ok(ApiResponse.success("Resource retrieved successfully", resourceService.getResourceById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ResourceDto>> createResource(@Valid @RequestBody ResourceDto resourceDto) {
        return ResponseEntity
                .ok(ApiResponse.success("Resource created successfully", resourceService.createResource(resourceDto)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ResourceDto>> updateResource(@PathVariable Long id,
            @RequestBody ResourceDto resourceDto) {
        return ResponseEntity.ok(
                ApiResponse.success("Resource updated successfully", resourceService.updateResource(id, resourceDto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.ok(ApiResponse.success("Resource deleted successfully"));
    }
}
