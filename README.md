# Employee Hierarchy Management

A scalable and robust REST API for managing employee hierarchies, featuring authentication, caching, structured logging, and comprehensive testing. Designed to handle increasing complexity with ease, ensuring maintainability and performance.

## Features

- **JWT based Authentication**: Secure user authentication using JSON Web Tokens.
- **Optimized Query Performance**: Utilize Materialized Common Table Expressions (CTE) for efficient data retrieval.
- **In Memory Caching**: Enhance performance with Node-Cache for frequently accessed data.
- **Structured Logging**: Implement comprehensive logging with Winston for easy debugging and monitoring.
- **Rate Limiting**: Protect the API from abuse with express-rate-limit.
- **Request Compression**: Improve response times with compression middleware.
- **Comprehensive Testing**: Ensure reliability with unit and e2e tests using Mocha, Chai, Sinon, and Supertest.

## Technical Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL, Sequelize ORM
- **Authentication**: JSON Web Tokens (JWT)
- **Logging**: Winston
- **Caching**: Node-Cache
- **Testing**: Mocha, Chai, Sinon, Supertest
- **Other Tools**: dotenv, compression, express-rate-limit

## Installation

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/ShinobiSaad/employeemanager.git
   cd employeemanager
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   - Open `.env` and set your configuration:

     ```env
     DB_USER=postgres
     DB_PASS=your_pass
     DB_NAME=employee
     DB_HOST=localhost
     DB_PORT=5432
     JWT_SECRET=your_secret_key
     ```

## Database Migration

### 1. Create the Database

Ensure PostgreSQL is running, then create the database:

createdb employee

### 2. Run Migrations

npx sequelize-cli db:migrate

## Running the Application

cd src
node app.js

The server will start on `http://localhost:3000` by default.

## Running Tests

- **Unit Tests**

  ```bash
  npm run test:unit
  ```

- **End-to-End Tests**

  ```bash
  npm run test:e2e
  ```

## API Documentation

### Employee Hierarchy

- **Endpoint**

  ```
  GET /api/hierarchy/:id
  ```

- **Response**

  - **Success (200 OK)**

    ```json
    [
    	{
    		"id": 1,
    		"name": "Name 1",
    		"positionId": 1,
    		"positionName": "CEO",
    		"child": [
    			{
    				"id": 2,
    				"name": "Name 2",
    				"positionId": 2,
    				"positionName": "Manager",
    				"child": []
    			}
    		]
    	}
    ]
    ```

#### Register User

- **Endpoint**

  ```
  POST /auth/register
  ```

- **Request Body**

  ```json
  {
  	"name": "Name 1",
  	"positionId": 1,
  	"positionName": "Manager",
  	"parentId": null
  }
  ```

- **Response**

  - **Success (201 Created)**

    ```json
    {
    	"id": 1,
    	"name": "Name 1",
    	"token": "token"
    }
    ```

#### Login

- **Endpoint**

  ```
  POST /auth/login
  ```

- **Request Body**

  ```json
  {
  	"id": 1,
  	"name": "Name 1"
  }
  ```

- **Response**

  - **Success (200 OK)**

    ```json
    {
    	"token": "token"
    }
    ```

### Logging & Monitoring

- **Structured Logging with Winston**
  - Logs are output in JSON format.
  - Supports multiple log levels
  - Logs are written to both console and files (`error.log`, `combined.log`).

### Scaling

To ensure effective logging and monitoring as the system grows, implement the following strategies:

1. **Logging**

   - **Using of the ELK (Elasticsearch, Logstash, Kibana) Stack: Storing and indexing logs, Processes and forwards logs and Visualizes and analyzes logs**
   - **AWS CloudWatch: Integrate Winston with CloudWatch for centralized log management**
   - **Kibana dashboards for real-time log monitoring and analysis**
   - **Automated Log Rotation: Implement log rotation to manage disk space**

2. **Monitoring**

   - **Metrics Collection with Prometheus: req rates, error rates, response times etc**
   - **Visualization with Grafana: Creating dashboards**
   - **Alerting:Set up alerts for critical metrics**
   - **APM Tools (New Relic, Datadog): Monitor application performance in real-time**

## Deployment Guide

### Docker Deployment

Contenarizing using docker for deployment

1. **Create a `Dockerfile`**

   ```dockerfile
   # Use official Node.js LTS image
   FROM node:18-alpine

   # Set working directory
   WORKDIR /app

   # Copy package.json and package-lock.json
   COPY package*.json ./

   # Install dependencies
   RUN npm install --production

   # Copy the rest of the application
   COPY . .

   # Expose port
   EXPOSE 3000

   # Start the application
   CMD ["npm", "start"]
   ```

2. **Build the Docker Image**

   ```bash
   docker build -t employee .
   ```

3. **Run the Docker Container**

   ```bash
   docker run -d \
     -p 3000:3000 \
     -e DB_USER=postgres \
     -e DB_PASS=1050 \
     -e DB_NAME=employee \
     -e DB_HOST=host.docker.internal \
     -e DB_PORT=5432 \
     -e JWT_SECRET=token \
     --name employee \
     employee
   ```

### Cloud Deployment (AWS)

Deploy the application using AWS ECS for scalable container management.
