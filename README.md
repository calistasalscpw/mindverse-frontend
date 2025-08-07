# MindVerse Frontend 

This repository hosts the **frontend application** for MindVerse, a collaborative platform designed to streamline task management and foster community engagement. Built with **React** and powered by **Ant Design**, it offers an intuitive user experience with dynamic dashboards and interactive forums.

---
## Key Features

* **Personal Dashboard:** Organize and track tasks with a visual, column-based layout.
* **Team Collaboration:** Manage team members and task assignments efficiently.
* **Community Forum:** Engage in discussions, share knowledge, and connect with other users.
* **Secure Authentication:** User registration and login functionalities.
* **Interactive Chatbot:** An AI-powered assistant for quick queries and support.
* **AI-Scheduled Meeting** An AI-powered team meeting scheduler based on task priority.

---
## Technologies & Tools

* **Framework:** React (with Vite)
* **UI Library:** Ant Design
* **Routing:** React Router DOM
* **State Management:** React Context API
* **API Communication:** Axios

---
## Core Components & Pages
### Components (`src/components/`)

* **`Navbar.jsx`** 
    * **Description:** The fixed top navigation bar, providing quick access to **Dashboard** and **Forum**, integrated search functionality, and a user profile dropdown menu.
* **`ChatBot.jsx`** 
    * **Description:** A discreet floating chatbot assistant, offering animated UI feedback and maintaining a history of user interactions for seamless query resolution.
* **`LoginForm.jsx`** 
    * **Description:** The essential form component for user authentication, featuring email and password input fields, styled with Ant Design's elegant components.
* **`ForumPostCard.jsx`** 
    * **Description:** A reusable card component to visually represent a forum post summary, including the author's information and the total comment count.
* **`TaskCreate.jsx`** 
    * **Description:** A modal form interface allowing users to **create new tasks**. This includes fields for task assignment, due dates, and detailed descriptions.
* **`TaskEdit.jsx`** 
    * **Description:** A modal form designed for **editing existing tasks**, providing a similar intuitive interface and functionality to the `TaskCreate` component.

### Contexts (`src/contexts/`)

* **`AuthContext.jsx`** 
    * **Description:** Implements the **React Context API** to provide global authentication state throughout the application. It includes user information (`user`) and methods for managing authentication status (`login`, `logout`).

### Pages (`src/pages/`)

* **`Home.jsx`** 
    * **Description:** The central personal dashboard. It features interactive, draggable task columns for organizing workflow and a dynamic list of team members.
* **`Forum.jsx`** 
    * **Description:** The main community forum page, displaying a comprehensive listing of posts, equipped with search capabilities and pagination for easy navigation.
* **`ForumPostDetail.jsx`** 
    * **Description:** Provides a detailed view of an individual forum post, allowing users to read the full content and associated comments.
* **`CreatePost.jsx`** 
    * **Description:** A modal interface facilitating the creation of new forum posts, enabling users to contribute to the community discussion seamlessly.
* **`Login.jsx`** 
    * **Description:** The dedicated login page, serving as a container that renders the `LoginForm` component for user authentication.
* **`Signup.jsx`** 
    * **Description:** The user registration page, offering options for profile image uploads and integrating Google login for convenience.

---

## 🚦 Frontend Routing

The application's navigation is managed by React Router DOM, providing clean and intuitive URLs:

* `/` ➡️ Home Dashboard
* `/auth/signup` ➡️ User Registration Page
* `/auth/login` ➡️ User Login Page
* `/addtask` ➡️ Opens the Task Creation Modal (popup)
* `/edittask` ➡️ Opens the Task Editing Modal (popup)
* `/forum` ➡️ Community Forum Main Page
* `/forum/:postId` ➡️ Detailed View for a Specific Forum Post

---

## Getting Started (Frontend)

To run the MindVerse frontend locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/calistasalscpw/mindverse-frontend.git
    ```
2.  **Navigate to the frontend directory:**
    ```bash
    cd mindverse-frontend
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    ```
4.  **Start the development server:**
    ```bash
    npm run dev
    # or yarn dev
    ```
    The application will typically be accessible at [http://localhost:5173/](http://localhost:5173/).

---

**Note:** Ensure your MindVerse backend server is running to enable full application functionality.
