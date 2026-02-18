# Campus Resource Management System Backend

Backend implementation for the Campus Resource Management System using Spring Boot 3, PostgreSQL, and JWT Authentication.

## Features

- **User Management**: Admin, Staff, Student roles.
- **Resources**: Labs, Classrooms, Halls, Equipment.
- **Booking System**: Request, Approve, Cancel bookings.
- **Security**: JWT based authentication.
- **Audit Logging**: Track all actions.
- **Notifications**: Email notifications (mocked).

## Requirements

- Java 17+
- Maven 3.8+
- PostgreSQL

## Setup

1. **Database**: Create a PostgreSQL database named `campus_crm`.
2. **Configuration**: Update `src/main/resources/application.yml` with your database credentials.
3. **Run**:
   ```sh
   mvn spring-boot:run
   ```
4. **Swagger UI**: Visit `http://localhost:8080/swagger-ui.html` for API documentation.

## Docker

Run with Docker Compose:
```sh
docker-compose up -d
```
