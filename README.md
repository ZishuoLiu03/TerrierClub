# ClubScout (Terrier Club Finder)

ClubScout is a full-stack web application designed to help students find social clubs that match their interests. It features a questionnaire-based recommendation system and allows users to explore various clubs.

## 🚀 Tech Stack

### Frontend
-   **React** (v19)
-   **Vite** (for fast build and dev server)
-   **TailwindCSS** (for styling)

### Backend
-   **Node.js** & **Express**
-   **Google Cloud Firestore** (Database)

## 📋 Prerequisites

Ensure you have the following installed on your machine:
-   **Node.js** (Latest LTS recommended)
-   **npm** (comes with Node.js)
-   **Google Cloud Service Account Key**

## 🛠️ Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd TerrierClub_Final
    ```

2.  **Install Dependencies:**

    You need to install dependencies for both the `client` and `server`.

    *For the Server:*
    ```bash
    cd ClubScout/server
    npm install
    ```

    *For the Client:*
    ```bash
    cd ../client
    npm install
    ```

3.  **Setup Google Firestore Credentials:**
    
    To allow the backend to talk to Google Cloud, you need a Service Account Key:

    1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
    2.  Select your project (`clubscout`).
    3.  Navigate to **IAM & Admin** > **Service Accounts**.
    4.  Click **+ CREATE SERVICE ACCOUNT**.
    5.  Give it a name (e.g., `clubscout-backend`) and click **Create and Continue**.
    6.  In "Grant this service account access to project", select **Firebase Admin SDK Administrator Service Agent** (or basic **Editor** role for testing). Click **Done**.
    7.  Click on the newly created email address to open its details.
    8.  Go to the **KEYS** tab.
    9.  Click **ADD KEY** > **Create new key**.
    10. Select **JSON** and click **Create**.
    11. A file will download. **Rename this file** to `service-account.json`.
    12. Move this file into the `TerrierClub_Final/ClubScout` folder (the parent of `server`, or inside `server` but update path in `firebase.js` if you do).
    
    > **Security Note:** NEVER commit this file to GitHub! It contains your private secret keys.

## 🏃‍♂️ Running the Project

To run the application, you will need two terminal windows (one for the backend and one for the frontend).

### 1. Start the Backend Server
Navigate to the `server` directory and start the server:
```bash
cd ClubScout/server
npm start
```

### 2. Start the Frontend Client
Navigate to the `client` directory and start the development server:
```bash
cd ClubScout/client
npm run dev
```
The application should now be accessible at `http://localhost:5173` (or the port shown in your terminal).

## 🗄️ Database Migration (Cleanup)
We have migrated from Prisma/SQLite to Firestore. You can safely remove the following old files if they exist:
- `ClubScout/server/prisma/` (Folder)
- `ClubScout/server/dev.db` (File)
- `ClubScout/server/src/routes.js` (Old routes file)

## 🚀 Deployment Guide

### 1. Backend (Google Cloud Run)
1.  **Build the container:**
    ```bash
    cd ClubScout/server
    gcloud builds submit --tag gcr.io/clubscout-480405/server --project clubscout-480405
    ```

2.  **Deploy to Cloud Run:**
    ```bash
    gcloud run deploy clubscout-backend \
      --image gcr.io/clubscout-480405/server \
      --project clubscout-480405 \
      --platform managed \
      --region us-central1 \
      --allow-unauthenticated
    ```
3.  **Copy the URL:** Google will print a URL (e.g., `https://clubscout-backend-xyz.a.run.app`).

### 2. Frontend (Vercel)
1.  Install Vercel CLI: `npm i -g vercel`
2.  Deploy:
    ```bash
    cd ClubScout/client
    vercel
    ```
3.  **Set Environment Variable:**
    - When asked, use default settings.
    - Go to your Vercel Dashboard > Settings > Environment Variables.
    - Add `VITE_API_URL` with the value of your **Backend URL** (from step 2) + `/api`.
      - Example: `https://clubscout-backend-xyz.a.run.app/api`
    - **Redeploy** the frontend for changes to take effect.

## 📝 License

This project is licensed under the ISC License.