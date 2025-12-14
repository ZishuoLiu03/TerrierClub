const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

let serviceAccount;

try {
    // Option 1: Load from a file path specified in env or default location
    // You should place your service-account.json in the server root or specify GOOGLE_APPLICATION_CREDENTIALS
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        // If env var is set, admin.initializeApp() will use it automatically if we don't pass credential
        // But specific handling can be useful
        console.log("Using GOOGLE_APPLICATION_CREDENTIALS");
    } else {
        // Option 2: Look for 'service-account.json' in TerrierClub_Final root (parent of ClubScout)
        const keyPath = path.join(__dirname, '../../../service-account.json');
        console.log("Attempting to load service account from:", keyPath);
        serviceAccount = require(keyPath);
        console.log("Successfully loaded service account.");
    }
} catch (e) {
    console.error("Error loading service account:", e.message);
    console.log("No partial service-account.json found or needed if running on Google Cloud.");
}

if (!admin.apps.length) {
    if (serviceAccount) {
        console.log("Initializing Firebase with service account cert.");
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } else {
        console.log("Initializing Firebase with Application Default Credentials (ADC).");
        // Fallback to Application Default Credentials (works on GCP automatically)
        admin.initializeApp();
    }
}

const db = admin.firestore();

module.exports = { db };
