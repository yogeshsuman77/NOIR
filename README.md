# NOIR 🕵️‍♂️

**NOIR** is a full-stack MERN web application that works like a digital investigation board.  
Users can create cases, add different types of clues, and visually connect them to analyze information in a free-form board environment.

The project focuses on complex user interactions, spatial UI handling, and real-world full-stack architecture.

---

## ✨ Features

- Create and manage investigation cases
- Add multiple types of clues:
  - Text clues
  - Image clues
  - Video clues
- Drag and reposition clues freely on the board
- Connect clues visually to represent relationships
- Pan and zoom across an infinite board space
- Edit and delete clues
- Smooth, interactive board experience

---

## 🛠 Tech Stack

### Frontend
- React
- JavaScript (ES6+)
- HTML5, CSS3
- Canvas / DOM-based interactions
- State management using React hooks

### Backend
- Node.js
- Express.js
- MongoDB
- RESTful APIs

### Other Tools
- Git & GitHub
- VS Code

---

## 🧠 What I Learned

- Designing interactive UIs with drag, pan, and zoom functionality
- Managing complex frontend state efficiently
- Structuring REST APIs for scalable applications
- Data modeling for relational concepts like connected clues
- Handling real-world frontend–backend integration challenges
- Debugging and improving user experience iteratively

---

## 📂 Project Structure

```text
NOIR
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── routes
│   │   ├── models
│   │   ├── middlewares
│   │   └── services
│   └── server.js
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── state
│   │   ├── utils
│   │   └── adapters
│   └── main.jsx
└── README.md
```


## 🚀 Getting Started (Local Setup)

Follow the steps below to run **NOIR** locally on your machine.

### Prerequisites
- Node.js
- MongoDB
- Git

---

### 📥 Clone the Repository

    git clone https://github.com/yogeshsuman77/noir.git
    cd noir

---

### 📦 Install Dependencies

#### Frontend

    cd frontend
    npm install

#### Backend

    cd backend
    npm install

---

### ▶️ Run the Application

#### Start Backend Server

    cd backend
    npm run dev

#### Start Frontend

    cd frontend
    npm start

The frontend will run on http://localhost:5000  
The backend will run on its configured port.

---

## 🔮 Future Improvements
 
- Collaboration on shared investigation boards
- Performance optimizations for large-scale boards

---

## 👤 Author

**Yogesh Suman**  
MERN Stack Developer  

Built as a personal project to strengthen full-stack development skills through a real-world, interaction-heavy application.

---

## 📌 Note

This project was built independently as a learning-focused, real-world application and is not a tutorial-based clone.