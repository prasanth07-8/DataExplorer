package com.campus.crm.service;

import com.campus.crm.dto.BookingDto;
import com.campus.crm.model.Booking;
import com.campus.crm.model.Resource;
import com.campus.crm.model.User;
import com.campus.crm.repository.BookingRepository;
import com.campus.crm.repository.ResourceRepository;
import com.campus.crm.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
// Removed UUID

@Service
@RequiredArgsConstructor
public class BookingService {

        private final BookingRepository bookingRepository;
        private final ResourceRepository resourceRepository;
        private final UserRepository userRepository;
        private final AuditService auditService;
        private final NotificationService notificationService;

        public Page<BookingDto> getAllBookings(Pageable pageable) {
                return bookingRepository.findAll(pageable).map(BookingDto::fromEntity);
        }

        public Page<BookingDto> getBookingsByUser(Long userId, Pageable pageable) {
                return bookingRepository.findByUserId(userId, pageable).map(BookingDto::fromEntity);
        }

        @Transactional
        public BookingDto createBooking(BookingDto bookingDto, Long userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new EntityNotFoundException("User not found"));

                Resource resource = resourceRepository.findById(bookingDto.getResourceId())
                                .orElseThrow(() -> new EntityNotFoundException("Resource not found"));

                if (resource.getStatus() != Resource.ResourceStatus.AVAILABLE) {
                        throw new IllegalStateException("Resource is not available for booking");
                }

                // Check conflicts
                List<Booking.BookingStatus> activeStatuses = Arrays.asList(Booking.BookingStatus.APPROVED,
                                Booking.BookingStatus.PENDING);
                List<Booking> conflicts = bookingRepository.findConflictingBookings(
                                resource.getId(),
                                bookingDto.getBookingDate(),
                                bookingDto.getStartTime(),
                                bookingDto.getEndTime(),
                                activeStatuses);

                if (!conflicts.isEmpty()) {
                        throw new IllegalStateException("Resource is already booked for the selected time");
                }

                Booking booking = Booking.builder()
                                .user(user)
                                .resource(resource)
                                .bookingDate(bookingDto.getBookingDate())
                                .startTime(bookingDto.getStartTime())
                                .endTime(bookingDto.getEndTime())
                                .status(Booking.BookingStatus.PENDING)
                                .build();

                Booking savedBooking = bookingRepository.save(booking);

                auditService.logAction("CREATE_BOOKING", "Booking", savedBooking.getId().toString(), userId.toString());
                notificationService.sendNotification(user.getEmail(), "Booking Created",
                                "Your booking for " + resource.getName() + " is currently PENDING approval.");

                return BookingDto.fromEntity(savedBooking);
        }

        @Transactional
        public BookingDto updateBookingStatus(Long id, Booking.BookingStatus status, Long approverId) {
                Booking booking = bookingRepository.findById(id)
                                .orElseThrow(() -> new EntityNotFoundException("Booking not found"));

                booking.setStatus(status);
                if (status == Booking.BookingStatus.APPROVED || status == Booking.BookingStatus.REJECTED) {
                        booking.setApprovalBy(approverId);
                }

                Booking savedBooking = bookingRepository.save(booking);

                auditService.logAction("UPDATE_BOOKING_STATUS", "Booking", savedBooking.getId().toString(),
                                approverId.toString());
                notificationService.sendNotification(booking.getUser().getEmail(), "Booking Status Update",
                                "Your booking for " + booking.getResource().getName() + " has been " + status);

                return BookingDto.fromEntity(savedBooking);
        }

        public void cancelBooking(Long id, Long userId) {
                Booking booking = bookingRepository.findById(id)
                                .orElseThrow(() -> new EntityNotFoundException("Booking not found"));

                if (!booking.getUser().getId().equals(userId)) {
                        throw new IllegalStateException("You can only cancel your own bookings");
                }

                booking.setStatus(Booking.BookingStatus.CANCELLED);
                bookingRepository.save(booking);

                auditService.logAction("CANCEL_BOOKING", "Booking", booking.getId().toString(), userId.toString());
                notificationService.sendNotification(booking.getUser().getEmail(), "Booking Cancelled",
                                "Your booking for " + booking.getResource().getName() + " has been CANCELLED.");
        }
}
