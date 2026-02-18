package com.campus.crm.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class AuthDto {

    @Data
    public static class LoginRequest {
        @NotBlank
        private String email;

        @NotBlank
        private String password;
    }

    @Data
    public static class SignupRequest {
        @NotBlank
        private String name;

        @NotBlank
        private String email;

        @NotBlank
        private String password;

        private String role; // Optional, defaults to STUDENT if null? Or we enforce providing it.

        private String phone;
        private String department;
    }

    @Data
    public static class JwtResponse {
        private String token;
        private String type = "Bearer";
        private String id;
        private String username;
        private String email;
        private String role;

        public JwtResponse(String accessToken, String id, String username, String email, String role) {
            this.token = accessToken;
            this.id = id;
            this.username = username;
            this.email = email;
            this.role = role;
        }
    }

    @Data
    public static class MessageResponse {
        private String message;

        public MessageResponse(String message) {
            this.message = message;
        }
    }
}
