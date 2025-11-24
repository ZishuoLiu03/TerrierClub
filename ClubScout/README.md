# Social Club Finder MVP

A full-stack web application to help college students find social clubs.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: SQLite, Prisma ORM

## Prerequisites
- [Node.js](https://nodejs.org/) (Version 18 or higher recommended)
- `npm` (comes with Node.js)

## Setup Instructions (For a new machine), Read this IF you have never set up the project before,
## IF you have set up the project before, skip to the "Running the Application" section.

### 1. Server Setup (Backend)
The backend handles the API and the database.

1.  Open a terminal and navigate to the `server` directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Initialize the Database (SQLite) and run migrations:
    ```bash
    npx prisma migrate dev --name init
    ```
4.  Seed the database with initial questions and clubs:
    ```bash
    node prisma/seed.js
    ```

### 2. Client Setup (Frontend)
The frontend is the user interface.

1.  Open a new terminal (or go back) and navigate to the `client` directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

## Running the Application

You need to run both the server and the client simultaneously (in two separate terminals).

### Start the Server
In the `server` directory:
```bash
node src/index.js
```
*You should see: `Server running on http://localhost:3000`*

### Start the Client
In the `client` directory:
```bash
npm run dev
```
*You should see a URL like `http://localhost:5173` and `Network: http://<YOUR_IP>:5173`.*

## Mobile Access (Testing on Phone)
1.  Ensure your phone and computer are on the **same WiFi network**.
2.  Look at the output of the `npm run dev` command in the client terminal.
3.  Find the **Network** URL (e.g., `http://192.168.1.5:5173`).
4.  Type that exact URL into your phone's web browser.
5.  You should see the app and be able to use it!

## Verifying Data(Optional)
To view the submitted answers in the database:

1.  In the `server` directory, run:
    ```bash
    npx prisma studio
    ```
2.  This will open a web interface. Click on the **Submission** model to see all records.
