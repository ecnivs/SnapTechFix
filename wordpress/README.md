# WordPress Headless CMS Setup for SnapTechFix

This directory contains the configuration for running WordPress in headless mode as a content management system for the SnapTechFix frontend.

## Prerequisites

- Docker and Docker Compose
- Node.js and npm (for frontend development)
- Ports 8000 and 8080 available

## Getting Started

1. **Start the WordPress containers**:
   ```bash
   docker-compose up -d
   ```

2. **Complete WordPress installation**:
   - Open http://localhost:8000/wp-admin in your browser
   - Follow the WordPress installation wizard
   - Create an admin user and save the credentials

3. **Run the setup script**:
   ```bash
   # Make the script executable
   chmod +x setup-wp.sh
   
   # Run the setup script
   ./setup-wp.sh
   ```

## Access Points

- **WordPress Admin**: http://localhost:8000/wp-admin
- **Frontend (Next.js)**: http://localhost:3000
- **phpMyAdmin**: http://localhost:8080
  - Username: root
  - Password: your_root_password (as set in docker-compose.yml)

## WordPress Configuration

### Custom Post Types
- **Services**: For managing repair services
- **Products**: For products available for purchase

### REST API Endpoints
- Base URL: `http://localhost:8000/wp-json/wp/v2/`
- JWT Authentication: `http://localhost:8000/wp-json/jwt-auth/v1/token`

## Development Workflow

1. Make content changes in WordPress admin
2. Use the REST API to fetch content in the Next.js frontend
3. Test changes locally before deploying

## Deployment

1. Update the `WORDPRESS_CONFIG_EXTRA` in your deployment environment to include the WordPress configuration
2. Set environment variables for production:
   - `WP_HOME`
   - `WP_SITEURL`
   - Database credentials
   - JWT secret key

## Troubleshooting

- **REST API not working**: Check if the JWT Authentication plugin is activated
- **404 errors**: Make sure permalinks are saved in WordPress settings
- **CORS issues**: Verify the CORS headers in wp-config-extra.php

## Security Notes

- Change all default passwords
- Keep WordPress and plugins updated
- Use HTTPS in production
- Regularly backup the database and uploads
