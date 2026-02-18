package com.campus.crm.service;

import com.campus.crm.dto.UserDto;
import com.campus.crm.model.User;
import com.campus.crm.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// Removed UUID

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Page<UserDto> getAllUsers(Pageable pageable) {
        return userRepository.findByDeletedFalse(pageable)
                .map(UserDto::fromEntity);
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        return UserDto.fromEntity(user);
    }

    @Transactional
    public UserDto updateUser(Long id, UserDto userDto) {
        User user = userRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));

        if (userDto.getName() != null)
            user.setName(userDto.getName());
        if (userDto.getPhone() != null)
            user.setPhone(userDto.getPhone());
        if (userDto.getDepartment() != null)
            user.setDepartment(userDto.getDepartment());
        if (userDto.getRole() != null)
            user.setRole(userDto.getRole());
        if (userDto.getStatus() != null)
            user.setStatus(userDto.getStatus());

        User updatedUser = userRepository.save(user);
        return UserDto.fromEntity(updatedUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        user.setDeleted(true);
        userRepository.save(user);
    }
}
