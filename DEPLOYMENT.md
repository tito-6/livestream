# eSports Platform Deployment Guide

This guide covers the complete deployment setup for the eSports streaming platform using Docker and Docker Compose.

## 🐳 Docker Architecture

The platform consists of four main services:

1. **PostgreSQL Database** - Data persistence layer
2. **API Gateway** - Go-based REST API and authentication
3. **Notification Service** - Node.js WebSocket service for real-time features
4. **Frontend** - Next.js React application

## 📋 Prerequisites

### Required Software
- **Docker** (version 20.10+)
- **Docker Compose** (version 2.0+)
- **Git** (for cloning the repository)

### System Requirements
- **RAM**: Minimum 4GB, Recommended 8GB+
- **CPU**: 2+ cores
- **Storage**: 10GB+ free space
- **Network**: Internet connection for pulling images

### Verify Installation
```bash
# Check Docker version
docker --version

# Check Docker Compose version
docker-compose --version

# Verify Docker is running
docker ps
```

## 🚀 Quick Start

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd streaming
```

### 2. Build and Start Services
```bash
# Build all services and start the platform
docker-compose up --build

# Or run in detached mode (background)
docker-compose up --build -d
```

### 3. Verify Services
```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs api-gateway
```

### 4. Access the Platform
- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **Notification Service**: http://localhost:3001
- **PostgreSQL**: localhost:5432

## 🔧 Service Configuration

### Database Service (PostgreSQL)
```yaml
# Configuration
POSTGRES_USER: esports_user
POSTGRES_PASSWORD: esports_password
POSTGRES_DB: esports_platform
PORT: 5432

# Data persistence
Volume: postgres_data:/var/lib/postgresql/data/
```

### API Gateway Service
```yaml
# Configuration
DATABASE_URL: postgres://esports_user:esports_password@db:5432/esports_platform?sslmode=disable
JWT_SECRET: your-super-secret-jwt-key-here
PORT: 8080

# Dependencies
- Database (health check required)
- Notification Service
```

### Notification Service
```yaml
# Configuration
PORT: 3001

# Features
- WebSocket connections
- Real-time polling
- Viewer count tracking
```

### Frontend Service
```yaml
# Configuration
NODE_ENV: development
PORT: 3000

# Dependencies
- API Gateway
- Notification Service
```

## 🛠️ Development Commands

### Build Services
```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build api-gateway

# Build with no cache
docker-compose build --no-cache
```

### Start/Stop Services
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs api-gateway

# Follow logs in real-time
docker-compose logs -f notification-svc

# Last 100 lines
docker-compose logs --tail=100
```

### Execute Commands
```bash
# Access API Gateway container
docker-compose exec api-gateway sh

# Access database
docker-compose exec db psql -U esports_user -d esports_platform

# Run tests in notification service
docker-compose exec notification-svc npm test
```

## 🔍 Health Checks

### Service Health Endpoints
```bash
# API Gateway health
curl http://localhost:8080/health

# Notification Service health
curl http://localhost:3001/health

# Database health (via API Gateway)
curl http://localhost:8080/health
```

### Docker Health Checks
```bash
# Check container health
docker-compose ps

# View health check logs
docker inspect esports-postgres-db | grep -A 10 Health
```

## 🗄️ Database Management

### Connect to Database
```bash
# Using Docker Compose
docker-compose exec db psql -U esports_user -d esports_platform

# Using external client
psql -h localhost -p 5432 -U esports_user -d esports_platform
```

### Database Operations
```sql
-- List tables
\dt

-- View users table
SELECT * FROM users;

-- Check database size
SELECT pg_size_pretty(pg_database_size('esports_platform'));
```

### Backup and Restore
```bash
# Backup database
docker-compose exec db pg_dump -U esports_user esports_platform > backup.sql

# Restore database
docker-compose exec -T db psql -U esports_user esports_platform < backup.sql
```

## 🔧 Environment Configuration

### Environment Variables
Create a `.env` file in the root directory:

```bash
# Database Configuration
POSTGRES_USER=esports_user
POSTGRES_PASSWORD=esports_password
POSTGRES_DB=esports_platform

# API Gateway Configuration
JWT_SECRET=your-super-secret-jwt-key-here
DATABASE_URL=postgres://esports_user:esports_password@db:5432/esports_platform?sslmode=disable

# Service Ports
API_GATEWAY_PORT=8080
NOTIFICATION_SVC_PORT=3001
FRONTEND_PORT=3000
DB_PORT=5432
```

### Production Configuration
For production deployment, update the following:

1. **Security**:
   - Change default passwords
   - Use strong JWT secrets
   - Enable SSL/TLS

2. **Performance**:
   - Increase resource limits
   - Configure connection pooling
   - Enable caching

3. **Monitoring**:
   - Add logging configuration
   - Set up health checks
   - Configure metrics collection

## 🚨 Troubleshooting

### Common Issues

#### 1. Port Conflicts
```bash
# Check if ports are in use
netstat -tulpn | grep :8080
netstat -tulpn | grep :3001
netstat -tulpn | grep :5432

# Stop conflicting services
sudo systemctl stop <service-name>
```

#### 2. Database Connection Issues
```bash
# Check database logs
docker-compose logs db

# Verify database is ready
docker-compose exec db pg_isready -U esports_user -d esports_platform

# Reset database
docker-compose down -v
docker-compose up -d db
```

#### 3. Build Failures
```bash
# Clean build cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache

# Check build logs
docker-compose build api-gateway
```

#### 4. Service Dependencies
```bash
# Check service dependencies
docker-compose config

# Start services in order
docker-compose up db
docker-compose up notification-svc
docker-compose up api-gateway
docker-compose up frontend
```

### Performance Issues

#### 1. High Memory Usage
```bash
# Check container resource usage
docker stats

# Limit container resources
# Add to docker-compose.yml:
deploy:
  resources:
    limits:
      memory: 512M
    reservations:
      memory: 256M
```

#### 2. Slow Database Queries
```bash
# Check database performance
docker-compose exec db psql -U esports_user -d esports_platform -c "SELECT * FROM pg_stat_activity;"

# Analyze slow queries
docker-compose exec db psql -U esports_user -d esports_platform -c "SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"
```

## 📊 Monitoring and Logging

### Container Monitoring
```bash
# Real-time container stats
docker stats

# Container resource usage
docker-compose top

# Service health status
docker-compose ps
```

### Log Management
```bash
# Centralized logging
docker-compose logs --tail=1000 > platform-logs.log

# Log rotation
docker-compose logs --since=1h > recent-logs.log

# Error filtering
docker-compose logs | grep ERROR
```

## 🔄 Updates and Maintenance

### Update Services
```bash
# Pull latest images
docker-compose pull

# Rebuild and restart
docker-compose up --build -d

# Update specific service
docker-compose up --build -d api-gateway
```

### Cleanup
```bash
# Remove unused containers
docker container prune

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Complete cleanup
docker system prune -a
```

## 🚀 Production Deployment

### Security Considerations
1. **Change default passwords**
2. **Use environment variables for secrets**
3. **Enable SSL/TLS encryption**
4. **Configure firewall rules**
5. **Regular security updates**

### Scaling Considerations
1. **Horizontal scaling with load balancers**
2. **Database replication and clustering**
3. **Caching layers (Redis)**
4. **CDN for static assets**
5. **Container orchestration (Kubernetes)**

### Backup Strategy
1. **Database backups (daily)**
2. **Configuration backups**
3. **Container image backups**
4. **Disaster recovery plan**

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Go Docker Best Practices](https://docs.docker.com/language/golang/)
