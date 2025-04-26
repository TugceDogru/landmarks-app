# Landmarks and Visiteds CRUD Application

This project is a simple web application that allows you to manage "landmarks" and "visited" records. The application performs CRUD (Create, Read, Update, Delete) operations on "landmarks" and "visiteds". It uses Node.js for the backend and MySQL for the database.

# Prerequisites

Before running this application, ensure you have the following installed:

- Node.js (version >= 14.0.0) – For the backend server
- MySQL – For the database
- A browser – To interact with the application

# Setup Instructions

1. Clone the Repository
```bash
git clone https://github.com/TugceDogru/landmarks-app.git
cd landmarks-app
```


2. Install Dependencies
```bash
npm install
```


3. Setup MySQL Database
```bash
CREATE DATABASE your_database_name;

USE your_database_name;

CREATE TABLE landmarks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  is_deleted TINYINT(1) DEFAULT 0
);

CREATE TABLE visiteds (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  landmark_id INT NOT NULL,
  visit_date DATE,
  is_deleted TINYINT(1) DEFAULT 0,
  FOREIGN KEY (landmark_id) REFERENCES landmarks(id)
);

```


4. Configure MySQL Connection
```bash
const db = mysql.createConnection({
  host: 'localhost',
  user: 'your_mysql_username',  // Change this
  password: 'your_mysql_password',  // Change this
  database: 'your_database_name'  // Change this
});
```

   
5. Start the Backend Server
```bash
node server.js
```
This will start the server on port 3000.


6. Open the Frontend
Open your index.html file in a browser, or use a simple HTTP server (like Live Server in Visual Studio Code) to load the frontend. The application will make requests to http://localhost:3000.


7. Use the Application

The application allows you to:
  - View a list of landmarks and visiteds
  - Add new landmarks or visited records
  - Update existing landmarks or visited records
  - Soft-delete records (using the "Delete" buttons)
    
