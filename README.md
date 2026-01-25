# Fin-Analysis        
<img src="frontend/src/assets/logo.svg" alt="Fin-Analysis Dashboard" width="100"/>

**AI-Powered Financial Integrity & Anomaly Detection**

Fin-Analysis is a modern wList of features offered by the solutioneb application designed to help businesses, auditors, and data analysts detect financial fraud and irregularities using advanced statistical methods, including **Benford's Law**. It provides an automated, secure, and user-friendly platform to validate financial data instantly.



---

## 🚀 Key Features

*   **🛡️ Benford’s Law Analysis**: Automatically validates natural data distribution to flag potential manipulation.
*   **📉 Anomaly Detection**: Highlights suspicious transactions and statistical outliers.
*   **📊 Interactive Dashboard**: Visualizes spending trends, category breakdowns, and risk summaries using Recharts.
*   **⚡ Instant Insights**: AI-generated text summaries explaining key findings in plain English.
*   **📂 File Support**: Drag-and-drop secure upload for CSV and Excel files.
*   **📝 PDF Reports**: Export professional analysis reports for documentation.
*   **🔐 Secure History**: Save and revisit past analyses (powered by Firebase).
*   **🌓 Dark Mode**: Fully responsive UI with seamless light/dark theme switching.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework**: React (Vite)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS, Shadcn/UI
*   **Visualization**: Recharts
*   **Animations**: Framer Motion
*   **State/Auth**: Firebase Auth, Context API

### Backend
*   **Framework**: FastAPI (Python)
*   **Data Processing**: Pandas, NumPy
*   **Database**: Firebase Firestore (NoSQL)
*   **PDF Generation**: ReportLab

---

## ⚙️ Setup & Installation

Follow these steps to run the project locally.

### Prerequisites
*   **Node.js** (v18+)
*   **Python** (v3.10+)
*   **Firebase Project**: You need a Firebase project with **Authentication** and **Firestore** enabled.

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Fin-Analysis.git
cd Fin-Analysis
```

### 2. Backend Setup (Python)

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment and install dependencies:

```bash
# Create venv
python -m venv venv

# Activate venv (Linux/Mac)
source venv/bin/activate
# Activate venv (Windows)
# venv\Scripts\activate

# Install requirements
pip install -r requirements.txt
```

**Environment Variables (.env)**
Create a `.env` file in the `backend/` directory:

```env
# Backend .env
PORT=8000
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
GOOGLE_APPLICATION_CREDENTIALS=service-account.json
```
*Note: You need to download a Service Account JSON key from Firebase Console -> Project Settings -> Service Accounts and place it in the `backend/` folder as `service-account.json`.*

Run the backend server:

```bash
uvicorn main:app --reload
```
The API will run at `http://localhost:8000`.

---

### 3. Frontend Setup (React)

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

**Environment Variables (.env)**
Create a `.env` file in the `frontend/` directory (or `.env.local`):

```env
# Frontend .env
VITE_API_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```
*Note: Get these values from your Firebase Console -> Project Settings -> General -> Your Apps -> SDK Setup.*

Run the frontend development server:

```bash
npm run dev
```
The app will open at `http://localhost:5173`.

---

## 📖 Usage Guide

1.  **Sign Up/Login**: Create an account to access the dashboard.
2.  **Upload Data**: Go to the "Upload" page and drop a CSV or Excel file containing financial transactions (Amount column is required).
3.  **Analyze**: The system processes the file and redirects to the Dashboard.
4.  **Review**: Check the Benford's Law chart for deviations and read the Insights summary.
5.  **Export**: Click "Export Report" to download a PDF version of the analysis.

---

## 🤝 Contributing

Contributions are welcome!
1.  Fork the repo.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

