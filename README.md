# Afghan Folklore Archive

Afghan Folklore Archive is a web application built to collect, preserve, and share Afghan folk stories. The idea behind the project is to bring traditional stories into a digital space where people can discover them, read them, and contribute stories of their own.

The application combines a story-browsing interface with user accounts, story submissions, and an administration system for reviewing and managing content.

## Features

### Story Discovery

- Browse approved stories.
- Search stories by title, description, and tags.
- Filter stories by category and language.
- Open individual story pages.
- Track story views.
- Like stories and save them for later.

### User Accounts

- Register and verify an email address.
- Sign in using an email and password.
- Request a password reset.
- Change passwords and update profile information.
- View personal story submissions.
- Access saved stories.

### Story Submission and Management

- Submit stories through the application.
- Upload an image with a story.
- Edit or delete your own submissions.
- Send new and edited stories for review.
- Return edited stories to the review process before they are approved again.

### Administration

- View statistics for stories, users, views, and bookmarks.
- Search and filter story submissions.
- Approve or reject stories.
- Search and manage user accounts.
- Delete user accounts and their associated stories.

## Technology Stack

**Frontend**

- React — user interface
- Vite — development server and build tooling
- React Router — client-side routing
- Tailwind CSS — styling
- Axios — communication with the backend API
- Framer Motion — interface animations
- Lucide React — icons

**Backend**

- Node.js and Express — server and REST API
- MongoDB and Mongoose — data storage and database operations
- JSON Web Tokens (JWT) — authentication
- bcryptjs — password hashing
- Nodemailer — email delivery
- Multer — image upload handling

## How the Application Works

The frontend sends requests to the backend through a set of API endpoints. The backend handles authentication, story operations, database access, and administrative actions.

MongoDB stores the application's persistent data. Authentication uses JWTs, and protected operations require an appropriate access token and authorization.

Story submissions are subject to moderation. Only approved stories are returned by the public story-browsing endpoint. When an existing story is edited, it returns to the review process.

Uploaded story images are served through the backend's `/uploads` route.

## Project Structure

```text
Afghan-Folklore-Archive/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── utils/
│   ├── server.js
│   ├── seed.js
│   ├── migrate.js
│   └── package.json
├── src/
│   └── services/
│       └── api.js
├── package.json
├── vite.config.js
└── README.md
```

The frontend and backend have separate dependency files and can be started independently during development.

## Getting Started

### Requirements

- Node.js and npm
- Access to a MongoDB database
- SMTP credentials for email verification and password recovery

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Afghan-Folklore-Archive
```

Replace `<repository-url>` with the repository's Git URL.

### 2. Install Frontend Dependencies

From the project root, run:

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_private_jwt_secret
JWT_EXPIRE=7d
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password_or_app_password
```

Replace the example values with your own settings. The `7d` value is an example expiration period for JWTs; use the value appropriate for your configuration.

Keep the `.env` file private. Never commit database credentials, email passwords, or secret keys to version control.

### 5. Start the Backend

From the `backend` directory:

```bash
npm run dev
```

The server connects to MongoDB before it begins listening for requests. By default, it uses port `5000` unless another port is configured.

### 6. Start the Frontend

Open a second terminal in the project root and run:

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

During development, Vite forwards requests to `/api` and `/uploads` to the backend at `http://localhost:5000`.

## API Overview

The backend provides the following main API groups:

| Endpoint       | Purpose                                                                      |
| -------------- | ---------------------------------------------------------------------------- |
| `/api/auth`    | Registration, email verification, login, account settings, and saved stories |
| `/api/stories` | Story browsing, submissions, editing, likes, views, and moderation           |
| `/api/admin`   | Administrative statistics and user/story management                          |
| `/api/health`  | Basic API health check                                                       |

Some endpoints require authentication, and administrative operations require appropriate permissions.

## Available Scripts

**Frontend** — run from the project root:

| Command           | Purpose                              |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the development server         |
| `npm run build`   | Build the frontend for production    |
| `npm run preview` | Preview the production build locally |

**Backend** — run from the `backend` directory:

| Command           | Purpose                         |
| ----------------- | ------------------------------- |
| `npm run dev`     | Start the backend in watch mode |
| `npm start`       | Start the backend normally      |
| `npm run seed`    | Run the database seeding script |
| `npm run migrate` | Run the migration script        |

Review the seeding and migration scripts before running them against a database containing important data.

## Security and Deployment

- Keep environment variables and credentials out of version control.
- Use a strong JWT secret and protect database access.
- Keep administrative operations restricted to authorized users.
- Use HTTPS when deploying the application publicly.
- Configure API routing and persistent file storage for the deployment environment.

The Vite proxy configuration is intended for local development. A production deployment needs its own appropriate routing and file-storage setup.

## Project Goal

Afghan folklore is part of the country's cultural heritage, carrying stories and traditions across generations. Recording and sharing these stories digitally can help make them easier to discover and preserve.

Afghan Folklore Archive is an ongoing project built around that idea. Its purpose is to provide a practical platform for collecting, reading, and sharing Afghan folk stories while giving contributors and administrators the tools to manage the content.
