package com.campus.crm.service;

import com.campus.crm.dto.ResourceDto;
import com.campus.crm.model.Resource;
import com.campus.crm.repository.ResourceRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public Page<ResourceDto> getAllResources(Pageable pageable) {
        return resourceRepository.findAll(pageable)
                .map(ResourceDto::fromEntity);
    }

    public Page<ResourceDto> getResourcesByType(Resource.ResourceType type, Pageable pageable) {
        return resourceRepository.findByType(type, pageable)
                .map(ResourceDto::fromEntity);
    }

    public ResourceDto getResourceById(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Resource not found with id: " + id));
        return ResourceDto.fromEntity(resource);
    }

    public ResourceDto createResource(ResourceDto resourceDto) {
        Resource resource = Resource.builder()
                .name(resourceDto.getName())
                .type(resourceDto.getType())
                .capacity(resourceDto.getCapacity())
                .location(resourceDto.getLocation())
                .description(resourceDto.getDescription())
                .status(resourceDto.getStatus() != null ? resourceDto.getStatus() : Resource.ResourceStatus.AVAILABLE)
                .build();

        return ResourceDto.fromEntity(resourceRepository.save(resource));
    }

    public ResourceDto updateResource(Long id, ResourceDto resourceDto) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Resource not found with id: " + id));

        if (resourceDto.getName() != null)
            resource.setName(resourceDto.getName());
        if (resourceDto.getType() != null)
            resource.setType(resourceDto.getType());
        if (resourceDto.getCapacity() > 0)
            resource.setCapacity(resourceDto.getCapacity());
        if (resourceDto.getLocation() != null)
            resource.setLocation(resourceDto.getLocation());
        if (resourceDto.getDescription() != null)
            resource.setDescription(resourceDto.getDescription());
        if (resourceDto.getStatus() != null)
            resource.setStatus(resourceDto.getStatus());

        return ResourceDto.fromEntity(resourceRepository.save(resource));
    }

    public void deleteResource(Long id) {
        if (!resourceRepository.existsById(id)) {
            throw new EntityNotFoundException("Resource not found with id: " + id);
        }
        resourceRepository.deleteById(id);
    }

}
