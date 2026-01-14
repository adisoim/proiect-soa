# Microservices Task Manager (SOA Project)

A comprehensive implementation of a Service-Oriented Architecture (SOA) for a Task Management application. This project demonstrates the use of Microservices, Micro-Frontends (Module Federation), Event-Driven Architecture, and Serverless functions.

![Architecture](./architecture.png)

## System Architecture

The application is composed of several independent services packaged in Docker containers and orchestrated via Docker Compose.

### Backend Services (Java Spring Boot 3 & Python)
* **Auth Service**: Handles User Registration and Login. Issues JWT tokens for stateless authentication.
* **Task Service**: Core business logic. Manages tasks, communicates with OpenFaaS for complexity calculation, and publishes events to RabbitMQ.
* **Notification Service**: A consumer service that listens to RabbitMQ events (e.g., TaskCreated) and triggers notifications (simulated).
* **OpenFaaS Function**: A serverless Python function that analyzes task descriptions to determine "complexity" or processing time.

### Frontend (React & Rspack)
* **Host App**: The shell application that stitches together the remote modules.
* **Auth MFE**: Micro-frontend responsible for Login/Register screens.
* **Tasks MFE**: Micro-frontend responsible for the Task Dashboard and management.
* **Technology**: Uses Webpack Module Federation (via Rspack) to load micro-frontends dynamically.

### Infrastructure
* **Nginx**: API Gateway / Reverse Proxy. Routes traffic to appropriate backend services and serves the frontend.
* **PostgreSQL**: Relational database for storing users and tasks.
* **RabbitMQ**: Message broker for asynchronous communication between Task and Notification services.

---

## Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Backend** | Java 21, Spring Boot 3.4, Hibernate/JPA, Python (Serverless) |
| **Frontend** | React 18, TypeScript, TailwindCSS, Rspack (Module Federation) |
| **Database** | PostgreSQL 16 |
| **Messaging** | RabbitMQ |
| **Infrastructure** | Docker, Docker Compose, Nginx, OpenFaaS |

---

## Getting Started

### Prerequisites
* Docker and Docker Compose installed.

### Installation & Running

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/proiect-soa.git](https://github.com/your-username/proiect-soa.git)
    cd proiect-soa
    ```

2.  **Start the Application**
    Run the following command to build and start all services (Backend, Frontend, DB, Broker):
    ```bash
    docker compose up --build
    ```

3.  **Access the Application**
    Open your browser and navigate to:
    * http://localhost (Main Application entry point via Nginx)

---

## API Endpoints (Gateway)

All requests should go through Nginx (Port 80).

| Service | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | POST | `/auth/register` | Register a new user |
| **Auth** | POST | `/auth/login` | Login and receive JWT |
| **Task** | GET | `/api/tasks` | Get all tasks (Requires Bearer Token) |
| **Task** | POST | `/api/tasks` | Create a task (Triggers Async Event) |
| **Task** | PUT | `/api/tasks/{id}` | Update task status |

---

## Application Flow (Example)

1.  **User Action**: User logs in via the Auth MFE.
2.  **Token**: Browser receives a JWT token.
3.  **Task Creation**: User creates a task "Fix Server Bug" via Tasks MFE.
4.  **Orchestration**:
    * TaskService receives the request.
    * It calls the OpenFaaS Python function to analyze the text.
    * The task is saved to PostgreSQL.
    * A message is published to RabbitMQ.
5.  **Async Processing**: NotificationService picks up the message and logs a notification.
6.  **UI Update**: The Task Dashboard updates to show the new task.

---

## Project Structure

```bash
├── auth-service/           # Spring Boot Auth Service
├── task-service/           # Spring Boot Task Service
├── notification-service/   # Spring Boot Notification Service
├── openfaas-function/      # Python Serverless Function
├── frontend/
│   ├── host/               # Module Federation Host
│   ├── auth/               # Auth Micro-frontend
│   └── tasks/              # Tasks Micro-frontend
├── nginx/                  # Gateway Configuration
├── docker-compose.yml      # Orchestration
└── architecture.png        # System Diagram
