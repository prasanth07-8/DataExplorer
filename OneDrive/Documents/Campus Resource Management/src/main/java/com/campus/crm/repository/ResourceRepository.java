package com.campus.crm.repository;

import com.campus.crm.model.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    Page<Resource> findByStatus(Resource.ResourceStatus status, Pageable pageable);

    Page<Resource> findByType(Resource.ResourceType type, Pageable pageable);
}
