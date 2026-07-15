<<<<<<< HEAD
# Swastik-AI
This is my project for IBM Skillsbuild intenship
=======
# Swastik AI

Swastik AI is a full-stack health companion designed to help people manage medicines more consistently. The application combines an intelligent assistant, medication reminders, dose tracking, and a simple dashboard so users can stay on top of their daily health routine.

This project is built as a modern web application with a Spring Boot backend and a React frontend, making it easy to extend with additional health features in the future.

## Overview

Swastik AI aims to make medication management easier through:

- Secure user authentication and account access
- Medicine reminder creation and management
- Dose logging and adherence tracking
- AI-powered assistance for medicine-related questions
- Notifications for upcoming doses
- A dashboard for quick health routine visibility

## Features

### User Experience
- Register and log in securely
- Access a dashboard with health-related summaries
- Manage reminders and notifications in one place
- Interact with an AI assistant for support and guidance

### Core Functionalities
- Create, update, and cancel reminders
- Track whether a dose was taken
- View medicine-related information
- Receive notifications around scheduled doses
- Use conversational assistance with Gemini-powered AI

## Tech Stack

### Backend
- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- MySQL
- JWT authentication
- Spring AI with Google GenAI
- Mail integration

### Frontend
- React
- Vite
- Redux
- React Router
- Tailwind CSS
- Recharts

## Project Structure

```text
swastik-ai/
├── medassist/                     # Spring Boot backend
│   └── src/
│       ├── main/java/             # Application controllers, services, models
│       └── main/resources/        # Configurations and application properties
│
└── medassit React/                # React frontend
    └── swastik-ai-frontend/
        └── src/                   # Pages, components, Redux state, API config
```

## Prerequisites

Before running the project locally, make sure you have the following installed:

- Java 21 or newer
- Maven
- Node.js 20+ and npm
- MySQL 8+
- A Google Gemini API key
- A Tavily API key (if enabled in your environment setup)

## Backend Setup

1. Navigate to the backend folder:

```bash
cd medassist
```

2. Set the required environment variables before starting the app.

Example environment variables:

```bash
export DB_URL=jdbc:mysql://localhost:3306/medassist
export DB_USERNAME=root
export DB_PASSWORD=your_password
export GEMINI_API_KEY=your_gemini_api_key
export TAVILY_API_KEY=your_tavily_api_key
export MAIL_HOST=smtp.gmail.com
export MAIL_PORT=587
export MAIL_USERNAME=your_email
export MAIL_APP_PASSWORD=your_app_password
```

3. Run the Spring Boot application:

```bash
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
.
\mvnw.cmd spring-boot:run
```

The backend should start on:

```text
http://localhost:8080
```

## Frontend Setup

1. Navigate to the frontend folder:

```bash
cd "medassit React/swastik-ai-frontend"
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend will usually be available at:

```text
http://localhost:5173
```

## Environment Notes

The backend configuration is defined in the Spring Boot properties file and uses environment variables for database access, AI integration, and mail delivery. Make sure your local environment provides these values before launching the app.

## API Overview

The backend exposes REST endpoints for authentication, reminders, medicines, notifications, dashboard data, and the AI assistant. The main areas include:

- Authentication routes under `/api/auth`
- Reminder routes under `/api/reminders`
- Medicine routes under `/api/medicines`
- Notification routes under `/api/notifications`
- Dashboard routes under `/api/dashboard`
- AI assistant routes under `/api/assistant`

## Running the Full Application

To use the project locally:

1. Start the MySQL database.
2. Run the backend from the `medassist` folder.
3. Start the frontend from the `swastik-ai-frontend` folder.
4. Open the frontend in your browser and register or log in.

## Contribution Guidelines

If you would like to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Open a pull request with a clear description

## License

A license has not been added yet. If you plan to publish this repository publicly, it is recommended to add an open-source license such as MIT or Apache 2.0.

## Suggested Next Improvements

Possible future enhancements for this project:

- Add a proper admin panel
- Improve reminder notifications and scheduling
- Add more personalized health insights
- Expand AI assistant capabilities
- Add test coverage for backend and frontend
- Improve deployment configuration for production
>>>>>>> add94f5 (Initial commit)
