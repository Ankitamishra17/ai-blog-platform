
# Project Overview: AI Blog Platform Backend

This document provides a high-level overview of the Node.js backend for the AI Blog Platform.

## 1. Project Purpose

The AI Blog Platform is designed to be a robust and scalable backend system for a modern blogging application. It handles user authentication, content creation and management, and user interaction features, providing the necessary APIs for a rich client-side experience. The "AI" aspect is mentioned in the project name, suggesting future integration points, though not directly observed in the provided backend code snippets (e.g., AI for content generation or analysis).

## 2. Key Features

The backend provides the following core functionalities:

*   **User Authentication:**
    *   Standard email and password registration and login.
    *   Google OAuth authentication via Firebase Admin SDK.
    *   Email verification for new user accounts.
    *   Forgot and reset password functionality using email.
*   **User Management:**
    *   CRUD operations for user accounts (create, read, update, delete).
*   **Blog Management:**
    *   CRUD operations for blog posts (create, retrieve single/multiple, update, delete).
    *   Support for rich text content (e.g., from EditorJS).
    *   Image upload and management for blog featured images using Cloudinary.
    *   Blog post drafting capabilities.
    *   Pagination for listing blog posts.
*   **User Interaction:**
    *   Liking/disliking blog posts.
    *   Adding, editing, deleting, and liking comments on blog posts.
*   **Search Functionality:**
    *   Searching for blog posts by title and description.

## 3. Technologies Used

The backend leverages a modern Node.js ecosystem:

*   **Backend Framework:** [Express.js](https://expressjs.com/) - A fast, unopinionated, minimalist web framework for Node.js.
*   **Database:** [MongoDB](https://www.mongodb.com/) - A NoSQL document database.
*   **ODM (Object Data Modeling):** [Mongoose](https://mongoosejs.com/) - A MongoDB object data modeling tool for Node.js, providing a straightforward, schema-based solution to model application data.
*   **Authentication:**
    *   [JSON Web Tokens (JWT)](https://jwt.io/) - For secure, stateless authentication.
    *   [bcrypt.js](https://www.npmjs.com/package/bcryptjs) - For hashing user passwords.
    *   [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) - For verifying Google ID tokens during OAuth.
*   **Email Services:**
    *   [Nodemailer](https://nodemailer.com/) - A module for Node.js applications to allow easy email sending. Used for email verification and password reset links.
*   **Image Upload & Storage:**
    *   [Cloudinary](https://cloudinary.com/) - A cloud-based media management platform for uploading, storing, and optimizing images.
    *   [Multer](https://github.com/expressjs/multer) - An Express.js middleware for handling `multipart/form-data`, primarily used for file uploads.
*   **Environment Variables:** [dotenv](https://github.com/motdotla/dotenv) - Loads environment variables from a `.env` file.
*   **Cross-Origin Resource Sharing (CORS):** [cors](https://github.com/expressjs/cors) - Express middleware to enable CORS with configurable options.

## 4. Architecture

The project follows a typical **monolithic backend architecture** for a web application:

*   **Server Setup (`server.js`):** Initializes the Express application, sets up middleware (CORS, JSON body parser), connects to the database, configures Cloudinary, and mounts the API routes.
*   **Routes (`routes/`):** Defines the API endpoints for different modules (user, blog, auth), delegating requests to respective controllers.
*   **Controllers (`controllers/`):** Contains the business logic for handling requests, interacting with the database models, performing validations, and sending responses.
*   **Models (`models/`):** Defines the Mongoose schemas and models for the application's data (User, Blog, Comment, Like).
*   **Middleware (`middlewares/`):** Contains reusable functions for request processing, such as authentication (`auth.js`).
*   **Utilities (`utils/`):** Houses helper functions for common tasks like JWT generation, email sending, image uploading, and file handling.
*   **Configuration (`config/`):** Manages external service configurations like database connection (`dbConnect.js`), Cloudinary (`cloudinaryConfig.js`), and Firebase Admin (`firebaseAdmin.js`).

## 5. Data Flow and Interactions

1.  **Client Request:** A frontend application sends an HTTP request to an API endpoint.
2.  **Express Server:** `server.js` receives the request, applies global middleware (CORS, `express.json`).
3.  **Routing:** The request is matched to a specific route handler in `userRoutes.js`, `blogRoutes.js`, or `authRoutes.js`.
4.  **Middleware (if any):** If the route requires authentication (`verifyUser`) or file uploads (`multer`), the corresponding middleware processes the request.
5.  **Controller Logic:** The controller function handles the request, performs:
    *   Input validation.
    *   Interaction with Mongoose models to query or update MongoDB.
    *   Calls to utility functions (e.g., `generateJWT`, `sendEmail`, `uploadImage`).
6.  **Response:** The controller sends an HTTP response back to the client, typically as JSON, indicating success or failure.

## 6. Future Enhancements

Based on the "AI Blog Platform" name, potential future enhancements could include:

*   Integration with AI services for content generation (e.g., drafts, summaries), SEO optimization, or image tagging.
*   Real-time notifications (e.g., for new comments or likes).
*   Advanced user profiles and author pages.
*   Categorization and tagging for blog posts.
*   Admin dashboard for content moderation.