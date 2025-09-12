# Relatim Full Stack Developer Role - Technical Assignment

This repository contains the complete solution for the Full Stack Developer - Round 1 Technical Assignment for Relatim.

The project is a **WhatsApp-style messaging application** built with a focus on a robust and scalable architecture and a modern, intuitive user interface.

## Key Features

1. Full-Stack Messaging: Users can send and receive messages in a dedicated chat window.
2. User Authentication: A secure authentication system is in place, featuring a multi-step registration process and a flexible login method using either a username or a phone number.
3. Dynamic Chat Interface: The sidebar displays a list of recent chats, which are automatically updated when a new conversation is started.
4. Unified Search: A single search bar in the sidebar allows users to search for both existing contacts and messages by name or content.
5. Contact Management: The application provides a popup to create new contacts.
6. User Blocking: Users can block a contact, preventing them from sending or receiving messages with that individual.
7. Intuitive UI/UX: The application features a two-sidebar layout and popups designed to mimic the familiar WhatsApp user experience.

## Tech Stack

- Frontend: React (with Hooks and Context API)
- Backend: Node.js and Express.js
- Database: PostgreSQL
- Other Libraries: `axios`, `bcrypt` (for password hashing), `react-router-dom`

## Setup and Installation

Follow these steps to set up and run the project locally.

### 1. Prerequisites

-   Node.js (v14 or higher) and npm installed.
-   PostgreSQL installed and running on your local machine.

### 2. Database Setup

1.  Connect to your PostgreSQL server using `pgAdmin` or your preferred client.
2.  Create a new database named `messaging_app`.
3.  Run the following SQL commands to create the necessary tables:

    ```sql
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE user_details (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        phone_number VARCHAR(20) UNIQUE NOT NULL
    );

    CREATE TABLE contacts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        contact_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE (user_id, contact_id)
    );

    CREATE TABLE messages (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        timestamp TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE blocked_users (
        id SERIAL PRIMARY KEY,
        blocker_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        blocked_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE (blocker_id, blocked_id)
    );
    ```

### 3. Backend Setup

1.  Navigate to the `backend` directory: `cd backend`
2.  Install dependencies: `npm install`
3.  Create a `.env` file and add your PostgreSQL credentials:
    ```
    DB_USER=your_username
    DB_HOST=localhost
    DB_NAME=messaging_app
    DB_PASSWORD=your_password
    DB_PORT=5432
    ```
4.  Run the server: `node index.js`

### 4. Frontend Setup

1.  Open a new terminal and navigate to the `frontend` directory: `cd frontend`
2.  Install dependencies: `npm install`
3.  Run the app: `npm start`
4.  The application will open in your browser at `http://localhost:3000`.


## How It Works

This guide outlines the core user flow to help you get started with the application.

- Registration: On the registration page, you will be guided through a simple 3-step process.

Step 1: Enter a 10-digit phone number and a password.

Step 2: Enter the mock OTP 1234 to verify your number.

Step 3: Provide an optional username. This will be the name displayed to others.

- Login: After registering, you will be redirected to the login page. You can log in using either the username or the phone number you registered with, along with your password.

- Find and Chat: Once logged in, the main chat interface appears.

- Use the search bar in the left-most sidebar to find any user by their name or phone number.

  Alternatively, click the + icon in the top-right of the chat list to open a popup where you can find or create a new contact.

- Message a User:

Click on a user from your chat list to open a chat window.

Type your message in the input box and click the send icon to send it. The chat history will be automatically updated.

- View Profile & Settings:

Click the profile icon in the bottom-left of the screen to open a popup displaying your profile details and a Log Out button.

Click the settings icon to open a popup with different sections like "Account," "Notification," and "Help." Clicking a section will navigate you within the same popup.

- Block a User:

Click on a contact's profile in the chat window's top bar to open their profile popup.

You will see an option to "Block User." A confirmation popup will appear.

## Architectural Notes

- MERN + PostgreSQL: The project was built using a traditional MERN stack approach but replaced MongoDB with PostgreSQL to demonstrate experience with relational databases. This choice is well-suited for a messaging application where the relationships between users, contacts, and messages are clearly defined.

- Component-Based Architecture: The frontend uses a modular, component-based structure. The main UI logic is contained in `MainLayout.js`, while smaller, reusable components handle specific features like the sidebar, popups, and chat window.

- React Context API: The user authentication state (`user` object) is managed using the React Context API, which provides a global state that is easily accessible by all components, simplifying the authentication flow.

- RESTful API: The backend provides a clear and organized RESTful API to handle all data operations. This separation of concerns allows the frontend and backend to evolve independently.

## Future Improvements

- Real-time Messaging: Implement WebSockets (e.g., using Socket.io) to enable real-time message updates without requiring a page reload.
- Group Chats: Extend the database schema and API to support group conversations.
- AI Chatbot Integration
- Status Page 
- Account management, Privacy settings, Phone Number Validation, Real OTP system, notification system
- Message Attachments: Allow users to send files, images, or videos as message attachments. This would involve a file upload API and secure storage (e.g., AWS S3).
- End-to-End Encryption: Implement end-to-end encryption for messages to ensure that only the sender and recipient can read their content, enhancing user privacy.
