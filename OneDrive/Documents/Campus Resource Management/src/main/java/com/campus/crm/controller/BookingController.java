package com.campus.crm.controller;

import com.campus.crm.common.ApiResponse;
import com.campus.crm.dto.BookingDto;
import com.campus.crm.model.Booking;
import com.campus.crm.security.services.UserDetailsImpl;
import com.campus.crm.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Page<BookingDto>>> getAllBookings(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        return ResponseEntity
                .ok(ApiResponse.success("Bookings retrieved successfully", bookingService.getAllBookings(pageable)));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<ApiResponse<Page<BookingDto>>> getMyBookings(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.success("My bookings retrieved successfully",
                bookingService.getBookingsByUser(userDetails.getId(), pageable)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BookingDto>> createBooking(@Valid @RequestBody BookingDto bookingDto,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Booking created successfully",
                bookingService.createBooking(bookingDto, userDetails.getId())));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<BookingDto>> updateBookingStatus(@PathVariable Long id,
            @RequestParam Booking.BookingStatus status,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Booking status updated successfully",
                bookingService.updateBookingStatus(id, status, userDetails.getId())));
    }

    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelBooking(@PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        bookingService.cancelBooking(id, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully"));
    }
}
