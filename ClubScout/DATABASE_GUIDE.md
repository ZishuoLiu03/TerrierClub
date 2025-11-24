# Database Maintenance & Survey Updates Guide

This guide explains how to manage your database when you want to launch a new survey, update questions, or archive old data.

## 1. Updating Questions & Clubs

All your questions and clubs are defined in the **Seed Script**. This is the source of truth for your initial data.

**File Location**: `server/prisma/seed.js`

### How to Edit:
1.  Open `server/prisma/seed.js` in your code editor.
2.  Locate the `const questions = [...]` array.
3.  **To Add a Question**: Add a new object to the array:
    ```javascript
    {
      text: "New Question Text?",
      category: "NewCategory",
      options: [
        { text: "Option A", value: "a" },
        { text: "Option B", value: "b" },
      ],
    },
    ```
4.  **To Remove a Question**: Simply delete the object from the array.
5.  **To Edit**: Change the text or values inside the objects.

---

## 2. Starting a New Survey Cycle (Reset & Update)

When you are ready to launch a new version of the survey, you usually want to clear the old test data and load your new questions.

### Option A: Clear Everything (Fresh Start)
This will **DELETE ALL DATA** (users, submissions) and reset the database to match your new seed script.

**Command (run in `server` folder):**
```powershell
npx prisma migrate reset
```
*You will be asked to confirm. Type `y`.*

This command automatically:
1.  Drops the database.
2.  Creates a new one.
3.  Runs the `seed.js` script to load your new questions.

---

## 3. Archiving Old Data

If you want to keep the old records before resetting, you should "archive" the database file. Since we are using SQLite, the entire database is just a single file!

**File Location**: `server/prisma/dev.db`

### How to Archive:
1.  **Stop the Server** (Ctrl+C in the terminal).
2.  Go to the `server/prisma` folder in your file explorer.
3.  Find the file named `dev.db`.
4.  **Rename it** to something descriptive, e.g., `survey_2023_archive.db`.
5.  Now, when you run the app or the reset command, Prisma will not find `dev.db`, so it will create a **new, empty** `dev.db` for your new survey.
6.  Your old data is safe in `survey_2023_archive.db`.

### How to View Archived Data:
To look at your old data later:
1.  Open `server/.env`.
2.  Change `DATABASE_URL="file:./dev.db"` to `DATABASE_URL="file:./survey_2023_archive.db"`.
3.  Run `npx prisma studio`.
4.  (Remember to change it back to `dev.db` when you want to run the live app!).
