# --- Stage 1: Build the Go application ---
FROM golang:1.21-alpine AS builder

# Set necessary environment variables
ENV CGO_ENABLED=0 \
    GOOS=linux

WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download all dependencies
RUN go mod download

# Copy the rest of the application source code
COPY . .

# Build the application
RUN go build -ldflags="-w -s" -o /api-gateway-bin ./main.go

# --- Stage 2: Create the minimal final image ---
FROM alpine:latest

# Install ca-certificates for secure connections (HTTPS/SSL) if needed, though for local testing, it might be optional.
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the built binary from the builder stage
COPY --from=builder /api-gateway-bin .

# Expose the port the application runs on
EXPOSE 8080

# Command to run the executable
CMD ["./api-gateway-bin"]
