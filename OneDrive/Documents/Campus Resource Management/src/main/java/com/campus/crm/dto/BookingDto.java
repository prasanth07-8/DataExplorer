package com.campus.crm.dto;

import com.campus.crm.model.Booking;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
public class BookingDto {
    private Long id;
    private Long userId;
    private String userName; // Helper field
    private Long resourceId;
    private String resourceName; // Helper field
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Booking.BookingStatus status;
    private Long approvalBy;

    public static BookingDto fromEntity(Booking booking) {
        return BookingDto.builder()
                .id(booking.getId())
                .userId(booking.getUser().getId())
                .userName(booking.getUser().getName())
                .resourceId(booking.getResource().getId())
                .resourceName(booking.getResource().getName())
                .bookingDate(booking.getBookingDate())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .status(booking.getStatus())
                .approvalBy(booking.getApprovalBy())
                .build();
    }
}
