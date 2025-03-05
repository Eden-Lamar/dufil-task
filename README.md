# Dufil Task

Go to [difil-task](https://dufil-task-client.vercel.app) to see the live project

---

This is a full-stack inventory management application built with a Node.js/Express backend and a React frontend. It allows users to register, log in, and manage inventory items securely. The application includes additional features like dark mode and an offline notification to enhance user experience.

1. **Backend:** Located in the `server` folder, powered by Express, MongoDB, and JWT for authentication.
2. **Frontend:** Located in the `client` folder, built with React, Vite, and HeroUI components.

---

### Features

##### Core Features

- **User Authentication:** Register and log in with email, username, and password.
- **Item Management:** Add and view inventory items (name and description) for authenticated users.
- **Pagination & Search:** Browse items with pagination and search by name or description.

##### Additional Features

- **Dark Mode:** Automatically adjusts the UI based on the system’s dark mode preference, enhancing accessibility and comfort in low-light environments.
- **Offline Notification:** Displays an alert when the user loses internet connectivity, improving usability during network disruptions.

---

### Prerequisites

Before setting up the application, ensure you have the following installed:

- Node.js (v20 or later recommended)
- npm (comes with Node.js)
- MongoDB (local instance or MongoDB Atlas URI)
- Git (optional, for cloning the repository)

### Setup Instructions

1. **Clone the Repository**
   If you’re using Git, clone the repo:

```
git clone <repository-url>
cd dufil
```

---

2. **Backend Setup (Server)**

   1. Navigate to the `server` folder:

   ```
   cd server
   ```

   2. **Install Dependencies:**

   ```
   npm install
   ```

   3. **Set Up Environment Variables:**

      - Create a `.env` file in the `server` folder.
      - Add the following:
        ```
        PORT=3000
        MONGO_URI=<your-mongodb-uri>
        JWT_SECRET=<your-secret-key>
        ```
        - Replace `<your-mongodb-uri>` with your MongoDB connection string (e.g., `mongodb://localhost:27017/inventory` for a local instance or a MongoDB Atlas URI).
        - Replace `<your-secret-key>` with a secure random string (e.g., `mysecretkey123`).

   4. **Run the Backend:**
      ```
      npm start
      ```
      - The server should start on `http://localhost:3000`. You’ll see:
      ```
      Server up on port 3000...
      Connected to <database-name> Database
      ```

3. **Frontend Setup (Client)**

   1. **Navigate to the client folder:**
      ```
      cd ../client
      ```
   2. **Install Dependencies:**
      ```
      npm install
      ```
   3. **Set Up Environment Variables:**

      - Create a `.env` file in the `client` folder.
      - Add the following:
        ```
         VITE_SERVER_BASE_URL=http://localhost:3000
        ```
      - Adjust if your backend runs on a different port or host.

   4. **Run the Frontend:**
      ```
      npm run dev
      ```
      - The app should open at `http://localhost:8080` in your browser.

---

4. **Verify the Application**

   - Open `http://localhost:8080` in your browser.
   - Register a new user at `/signup`.
   - Log in at `/login`.
   - Add items at `/add-items` and view them at `/`.
