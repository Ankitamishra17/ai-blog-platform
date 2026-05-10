
# API Testing Guide

This guide provides instructions and `curl` examples for testing the AI Blog Platform backend API.

**Base URL:** `http://localhost:PORT/api/v1` (Replace `PORT` with your configured port, typically `3000` or `process.env.PORT`).

**Authentication:**
Many endpoints require authentication. This is typically done by including a JSON Web Token (JWT) in the `Authorization` header as a `Bearer` token.
```
Authorization: Bearer <YOUR_AUTH_TOKEN>
```
You will receive an authentication token upon successful user `signin` or `signup`. For Google authentication, you'll provide the Firebase ID token in the `Authorization` header.

## 1. Authentication & User Management (authRoutes & userRoutes)

**Module:** User Authentication and Profile Management

### Register a new user
- **Endpoint:** `POST /api/v1/signup`
- **Purpose:** Creates a new user account with email and password.
- **Authentication:** None
- **Request Body:** `application/json`
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "securepassword123"
  }
  ```
- **Curl Example:**
  ```bash
  curl -X POST "http://localhost:3000/api/v1/signup" \
       -H "Content-Type: application/json" \
       -d '{
             "name": "John Doe",
             "email": "john.doe@example.com",
             "password": "securepassword123"
           }'
  ```

### User Login
- **Endpoint:** `POST /api/v1/signin`
- **Purpose:** Authenticates a user and returns a JWT token.
- **Authentication:** None
- **Request Body:** `application/json`
  ```json
  {
    "email": "john.doe@example.com",
    "password": "securepassword123"
  }
  ```
- **Curl Example:**
  ```bash
  curl -X POST "http://localhost:3000/api/v1/signin" \
       -H "Content-Type: application/json" \
       -d '{
             "email": "john.doe@example.com",
             "password": "securepassword123"
           }'
  ```

### Google Authentication
- **Endpoint:** `POST /api/v1/google-auth`
- **Purpose:** Authenticates/registers a user via Google ID Token (Firebase).
- **Authentication:** Bearer token in header (Google ID Token)
- **Request Headers:**
  ```
  Authorization: Bearer <GOOGLE_ID_TOKEN>
  ```
- **Request Body:** None
- **Curl Example:**
  ```bash
  curl -X POST "http://localhost:3000/api/v1/google-auth" \
       -H "Authorization: Bearer <YOUR_GOOGLE_ID_TOKEN>"
  ```

### Verify Email
- **Endpoint:** `GET /api/v1/verify-email/:verificationToken`
- **Purpose:** Verifies a user's email address using a token sent to their email.
- **Authentication:** None
- **Path Parameters:**
  - `verificationToken` (string): The token received in the email.
- **Curl Example:**
  ```bash
  curl -X GET "http://localhost:3000/api/v1/verify-email/<YOUR_VERIFICATION_TOKEN>"
  ```

### Forgot Password
- **Endpoint:** `POST /api/v1/forgot-password`
- **Purpose:** Sends a password reset link to the user's email.
- **Authentication:** None
- **Request Body:** `application/json`
  ```json
  {
    "email": "john.doe@example.com"
  }
  ```
- **Curl Example:**
  ```bash
  curl -X POST "http://localhost:3000/api/v1/forgot-password" \
       -H "Content-Type: application/json" \
       -d '{
             "email": "john.doe@example.com"
           }'
  ```

### Reset Password
- **Endpoint:** `POST /api/v1/reset-password/:token`
- **Purpose:** Resets the user's password using a valid reset token.
- **Authentication:** None
- **Path Parameters:**
  - `token` (string): The reset password token received in the email.
- **Request Body:** `application/json`
  ```json
  {
    "password": "new_secure_password"
  }
  ```
- **Curl Example:**
  ```bash
  curl -X POST "http://localhost:3000/api/v1/reset-password/<RESET_PASSWORD_TOKEN>" \
       -H "Content-Type: application/json" \
       -d '{
             "password": "new_secure_password"
           }'
  ```

### Get all users
- **Endpoint:** `GET /api/v1/users`
- **Purpose:** Retrieves a list of all registered users.
- **Authentication:** Required (Implicitly, as it's typically an admin/authorized operation, though middleware is not explicitly attached in `userRoutes.js`).
- **Curl Example:**
  ```bash
  curl -X GET "http://localhost:3000/api/v1/users" \
       -H "Authorization: Bearer <YOUR_AUTH_TOKEN>"
  ```

### Get user by ID
- **Endpoint:** `GET /api/v1/users/:id`
- **Purpose:** Retrieves a specific user by their ID.
- **Authentication:** Required (Implicitly, as it's typically an authorized operation, though middleware is not explicitly attached in `userRoutes.js`).
- **Path Parameters:**
  - `id` (string): The ID of the user.
- **Curl Example:**
  ```bash
  curl -X GET "http://localhost:3000/api/v1/users/<USER_ID>" \
       -H "Authorization: Bearer <YOUR_AUTH_TOKEN>"
  ```

### Update user by ID
- **Endpoint:** `PATCH /api/v1/users/:id`
- **Purpose:** Updates an existing user's information.
- **Authentication:** Required (Implicitly, as it's typically an authorized operation, though middleware is not explicitly attached in `userRoutes.js`).
- **Path Parameters:**
  - `id` (string): The ID of the user.
- **Request Body:** `application/json`
  ```json
  {
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "password": "updated_password"
  }
  ```
  (Any combination of fields can be updated)
- **Curl Example:**
  ```bash
  curl -X PATCH "http://localhost:3000/api/v1/users/<USER_ID>" \
       -H "Content-Type: application/json" \
       -H "Authorization: Bearer <YOUR_AUTH_TOKEN>" \
       -d '{
             "name": "Jane Doe",
             "email": "jane.doe@example.com"
           }'
  ```

### Delete user by ID
- **Endpoint:** `DELETE /api/v1/users/:id`
- **Purpose:** Deletes a user account.
- **Authentication:** Required (Implicitly, as it's typically an authorized operation, though middleware is not explicitly attached in `userRoutes.js`).
- **Path Parameters:**
  - `id` (string): The ID of the user.
- **Curl Example:**
  ```bash
  curl -X DELETE "http://localhost:3000/api/v1/users/<USER_ID>" \
       -H "Authorization: Bearer <YOUR_AUTH_TOKEN>"
  ```

## 2. Blog Management (blogRoutes)

**Module:** Blog Creation, Retrieval, and Interaction

### Create a new blog post
- **Endpoint:** `POST /api/v1/blogs`
- **Purpose:** Creates a new blog post, including image upload.
- **Authentication:** Required
- **Request Headers:**
  ```
  Authorization: Bearer <YOUR_AUTH_TOKEN>
  ```
- **Request Body:** `multipart/form-data`
  - `title` (string): Title of the blog post.
  - `description` (string): Short description.
  - `content` (string): JSON string representing the rich text content (e.g., from EditorJS).
  - `draft` (boolean): `true` if it's a draft, `false` to publish.
  - `image` (file): The blog's featured image.
- **Curl Example:**
  ```bash
  curl -X POST "http://localhost:3000/api/v1/blogs" \
       -H "Authorization: Bearer <YOUR_AUTH_TOKEN>" \
       -F "title=My New Blog Post" \
       -F "description=A brief description of my new blog." \
       -F "content={\"blocks\":[{\"id\":\"block1\",\"type\":\"paragraph\",\"data\":{\"text\":\"This is the content of my blog post.\"}}]}" \
       -F "draft=false" \
       -F "image=@/path/to/your/image.jpg"
  ```
  *Note: Ensure the `content` field is a valid JSON string.*

### Get all blog posts
- **Endpoint:** `GET /api/v1/blogs`
- **Purpose:** Retrieves a list of all published blog posts. Supports pagination.
- **Authentication:** None
- **Query Parameters:**
  - `page` (integer, optional): Page number (default: 1).
  - `limit` (integer, optional): Number of blogs per page (default: 3).
- **Curl Example:**
  ```bash
  curl -X GET "http://localhost:3000/api/v1/blogs?page=1&limit=5"
  ```

### Get a single blog post
- **Endpoint:** `GET /api/v1/blogs/:blogId`
- **Purpose:** Retrieves a single blog post by its unique `blogId` (slug).
- **Authentication:** None
- **Path Parameters:**
  - `blogId` (string): The unique slug/ID of the blog post.
- **Curl Example:**
  ```bash
  curl -X GET "http://localhost:3000/api/v1/blogs/my-new-blog-post-abc123xyz"
  ```

### Update a blog post
- **Endpoint:** `PATCH /api/v1/blogs/:id`
- **Purpose:** Updates an existing blog post (only by its creator). Can update text fields and/or the image.
- **Authentication:** Required (User must be the creator of the blog).
- **Path Parameters:**
  - `id` (string): The MongoDB `_id` of the blog post.
- **Request Body:** `multipart/form-data`
  - `title` (string, optional)
  - `description` (string, optional)
  - `draft` (boolean, optional)
  - `image` (file, optional): New featured image.
- **Curl Example (update text fields):**
  ```bash
  curl -X PATCH "http://localhost:3000/api/v1/blogs/<BLOG_MONGO_ID>" \
       -H "Authorization: Bearer <YOUR_AUTH_TOKEN>" \
       -F "title=Updated Blog Title" \
       -F "description=This blog has been updated." \
       -F "draft=true"
  ```
- **Curl Example (update image):**
  ```bash
  curl -X PATCH "http://localhost:3000/api/v1/blogs/<BLOG_MONGO_ID>" \
       -H "Authorization: Bearer <YOUR_AUTH_TOKEN>" \
       -F "image=@/path/to/your/new_image.png"
  ```

### Delete a blog post
- **Endpoint:** `DELETE /api/v1/blogs/:id`
- **Purpose:** Deletes a blog post (only by its creator).
- **Authentication:** Required (User must be the creator of the blog).
- **Path Parameters:**
  - `id` (string): The MongoDB `_id` or `blogId` (slug) of the blog post.
- **Curl Example:**
  ```bash
  curl -X DELETE "http://localhost:3000/api/v1/blogs/<BLOG_MONGO_ID_OR_SLUG>" \
       -H "Authorization: Bearer <YOUR_AUTH_TOKEN>"
  ```

### Like/Unlike a blog post
- **Endpoint:** `POST /api/v1/blogs/like/:id`
- **Purpose:** Toggles the like status for a blog post by the authenticated user.
- **Authentication:** Required
- **Path Parameters:**
  - `id` (string): The MongoDB `_id` of the blog post.
- **Curl Example:**
  ```bash
  curl -X POST "http://localhost:3000/api/v1/blogs/like/<BLOG_MONGO_ID>" \
       -H "Authorization: Bearer <YOUR_AUTH_TOKEN>"
  ```

### Add a comment to a blog post
- **Endpoint:** `POST /api/v1/blogs/comment/:id`
- **Purpose:** Adds a new comment to a specified blog post.
- **Authentication:** Required
- **Path Parameters:**
  - `id` (string): The MongoDB `_id` of the blog post.
- **Request Body:** `application/json`
  ```json
  {
    "comment": "This is a great blog post!"
  }
  ```
- **Curl Example:**
  ```bash
  curl -X POST "http://localhost:3000/api/v1/blogs/comment/<BLOG_MONGO_ID>" \
       -H "Content-Type: application/json" \
       -H "Authorization: Bearer <YOUR_AUTH_TOKEN>" \
       -d '{
             "comment": "This is a great blog post!"
           }'
  ```

### Delete a comment
- **Endpoint:** `DELETE /api/v1/blogs/comment/:id`
- **Purpose:** Deletes a comment (only by the comment creator or blog creator).
- **Authentication:** Required
- **Path Parameters:**
  - `id` (string): The MongoDB `_id` of the comment.
- **Curl Example:**
  ```bash
  curl -X DELETE "http://localhost:3000/api/v1/blogs/comment/<COMMENT_MONGO_ID>" \
       -H "Authorization: Bearer <YOUR_AUTH_TOKEN>"
  ```

### Edit a comment
- **Endpoint:** `PATCH /api/v1/blogs/edit-comment/:id`
- **Purpose:** Edits an existing comment (only by the comment creator).
- **Authentication:** Required
- **Path Parameters:**
  - `id` (string): The MongoDB `_id` of the comment.
- **Request Body:** `application/json`
  ```json
  {
    "updateComment": "This is an updated comment!"
  }
  ```
- **Curl Example:**
  ```bash
  curl -X PATCH "http://localhost:3000/api/v1/blogs/edit-comment/<COMMENT_MONGO_ID>" \
       -H "Content-Type: application/json" \
       -H "Authorization: Bearer <YOUR_AUTH_TOKEN>" \
       -d '{
             "updateComment": "This is an updated comment!"
           }'
  ```

### Like/Unlike a comment
- **Endpoint:** `PATCH /api/v1/blogs/like-comment/:id`
- **Purpose:** Toggles the like status for a comment by the authenticated user.
- **Authentication:** Required
- **Path Parameters:**
  - `id` (string): The MongoDB `_id` of the comment.
- **Curl Example:**
  ```bash
  curl -X PATCH "http://localhost:3000/api/v1/blogs/like-comment/<COMMENT_MONGO_ID>" \
       -H "Authorization: Bearer <YOUR_AUTH_TOKEN>"
  ```

### Search blog posts
- **Endpoint:** `GET /api/v1/search-blog`
- **Purpose:** Searches for blog posts based on title or description.
- **Authentication:** None
- **Query Parameters:**
  - `search` (string, required): The search term.
- **Curl Example:**
  ```bash
  curl -X GET "http://localhost:3000/api/v1/search-blog?search=nodejs"
  ```

