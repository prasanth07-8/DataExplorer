package com.campus.crm.dto;

import com.campus.crm.model.Role;
import com.campus.crm.model.User;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
// Removed UUID

@Data
@Builder
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Role role;
    private String department;
    private User.Status status;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;

    public static UserDto fromEntity(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .department(user.getDepartment())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .lastLogin(user.getLastLogin())
                .build();
    }
}
