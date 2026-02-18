package com.campus.crm.service;

import com.campus.crm.dto.UserDto;
import com.campus.crm.model.Role;
import com.campus.crm.model.User;
import com.campus.crm.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User user;
    private Long userId;

    @BeforeEach
    public void setUp() {
        userId = 1L;
        user = User.builder()
                .id(userId)
                .name("Test User")
                .email("test@example.com")
                .role(Role.ROLE_STUDENT)
                .status(User.Status.ACTIVE)
                .build();
    }

    @Test
    public void testGetUserById_Success() {
        when(userRepository.findByIdAndDeletedFalse(userId)).thenReturn(Optional.of(user));

        UserDto userDto = userService.getUserById(userId);

        assertNotNull(userDto);
        assertEquals(user.getEmail(), userDto.getEmail());
    }

    @Test
    public void testUpdateUser_Success() {
        when(userRepository.findByIdAndDeletedFalse(userId)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserDto updateDto = UserDto.builder()
                .name("Updated Name")
                .build();

        UserDto result = userService.updateUser(userId, updateDto);

        assertNotNull(result);
        verify(userRepository, times(1)).save(any(User.class));
    }
}
