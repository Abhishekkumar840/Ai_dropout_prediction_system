# AI Based Dropout Prediction

This repository contains a full-stack project for predicting student dropout risk using a React dashboard and a Node.js/Express backend.

## Project Structure

- `dropout-backend/`
  - Node.js Express API
  - `controllers/` for route handlers
  - `routes/` for API route definitions
  - `ml_model/` for prediction-related scripts and dataset files
  - `uploads/` for uploaded CSV files

- `dropout-dashboard/`
  - React dashboard application
  - `src/components/` contains main UI components
  - Uses `axios` to communicate with the backend API

## Prerequisites

- Node.js 18+ (or compatible)
- npm

## Setup

### Backend

1. Open terminal in `dropout-backend`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   node app.js
   ```

### Frontend

1. Open terminal in `dropout-dashboard`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm start
   ```

## Usage

- Use the React dashboard to upload student CSV files.
- The backend will process uploaded data and return dropout-related responses.
- The `ml_model/` folder contains prediction helpers and sample dataset files.

## Notes

- The backend uses `multer` for file uploads and `csv-parser` to read CSV data.
- The frontend relies on Material UI and Chart.js for the dashboard UI.
