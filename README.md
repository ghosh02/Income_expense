 # 💰SPENDLY - A Expense Management App

A full-stack MERN (MongoDB, Express, React, Node.js) application to manage your personal income and expenses. The app allows users to add, edit, delete, and filter their transactions with a clean and modern UI, built using Tailwind CSS and shadcn/ui components.

---

## 🚀 Features

### 🔐 Authentication
- User registration and login with hashed passwords
- JWT-based authentication with cookies
- Protected routes for secure access

### 🧾 Entry Management
- Add, edit, and delete income and expense entries
- Each entry includes:
  - Amount
  - Category (Income, Food, Housing, Travel, Others)
  - Type (Income or Expense)
  - Payment Method (Online or Offline)
  - Date
  - Optional Description

### 📊 Financial Summary
- Total income, total expense, and balance for the current month
- Monthly breakdown of finances
- Summary of previous 3 months

### 🔍 Filtering 
- Filter entries by:
  - Type
  - Date or date range
  - Category & Subcategory
  - Payment method

### 📈 UI / UX
- Responsive dashboard built with Tailwind CSS
- Modern components using `shadcn/ui`
- Paginated, sortable table to view all transactions
- Clean, mobile-friendly layout

---

## 🛠 Tech Stack

| Frontend        | Backend         | Database |
|-----------------|-----------------|----------|
| React JS        | Node.js         | MongoDB  |
| Tailwind CSS    | Express.js      | Mongoose |
| shadcn/ui       | JWT Auth        |          |
| Redux Toolkit   | bcryptjs        |          |
| Axios           | Cookie-parser   |          |

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/ghosh02/spendly.git
cd spendly
```
# Then move the pachage.json, pachage.json and .env file into the Backend folder
 Setup Backend
```bash
cd backend
npm install
```
crete a .env file
```bash
MONGO_URI=your_mongo_db_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```
Go to the Package.json file add this dev command
```bash
"dev": "nodemon index.js"

```
Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
📷 Screenshots

![Screenshot 2025-05-13 132220](https://github.com/user-attachments/assets/0d0ff096-bc87-4030-911c-7be0abad93b4)
![Screenshot 2025-05-13 132147](https://github.com/user-attachments/assets/fe90398e-fe87-4f3a-bff4-a4c7ae4121d2)
![WhatsApp Image 2025-05-13 at 1 17 35 PM](https://github.com/user-attachments/assets/d02a14b5-c270-41b6-a04f-5869a27d43bf)
![Screenshot 2025-05-13 131825](https://github.com/user-attachments/assets/c676c9ab-60ad-4d99-be3e-91ec53fea14f)

✍️ Author
# Sudip Ghosh
