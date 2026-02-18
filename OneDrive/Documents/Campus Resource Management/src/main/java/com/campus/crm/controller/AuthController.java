package com.campus.crm.controller;

import com.campus.crm.common.ApiResponse;
import com.campus.crm.dto.AuthDto.*;
import com.campus.crm.model.Role;
import com.campus.crm.model.User;
import com.campus.crm.repository.UserRepository;
import com.campus.crm.security.jwt.JwtUtils;
import com.campus.crm.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<ApiResponse<JwtResponse>> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(item -> item.getAuthority())
                .orElse(null);

        return ResponseEntity.ok(ApiResponse.success("Login successful", new JwtResponse(jwt,
                userDetails.getId().toString(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                role)));
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<?>> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(ApiResponse.error("Error: Email is already in use!", "EMAIL_EXISTS"));
        }

        // Create new user's account
        User user = User.builder()
                .name(signUpRequest.getName())
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .phone(signUpRequest.getPhone())
                .department(signUpRequest.getDepartment())
                .status(User.Status.ACTIVE)
                .build();

        String strRole = signUpRequest.getRole();
        if (strRole == null) {
            user.setRole(Role.ROLE_STUDENT);
        } else {
            try {
                user.setRole(Role.valueOf(strRole));
            } catch (IllegalArgumentException e) {
                user.setRole(Role.ROLE_STUDENT);
            }
        }

        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success("User registered successfully!"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<JwtResponse>> getCurrentUser(
            @org.springframework.security.core.annotation.AuthenticationPrincipal UserDetailsImpl userDetails) {
        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(item -> item.getAuthority())
                .orElse(null);

        return ResponseEntity.ok(ApiResponse.success("User details retrieved successfully", new JwtResponse(null,
                userDetails.getId().toString(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                role)));
    }
}
