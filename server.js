
const express = require('express');
const cors = require('cors');
const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

const app = express();
const port = process.env.PORT || 3000;
const dbPath = path.join(__dirname, './database.db');

// Middleware
app.use(express.json());
app.use(cors());

let db;

// Initialize database and server
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}/`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1); // Exit the process with failure code
  }
};

initializeDBAndServer();



app.get("/travel", async(req, res) => {
    const query = `SELECT * FROM travel`;
    const data = await db.all(query)
    res.status(200).send(data)
});


app.get("/travel/:id", async(req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM travel WHERE id = ${id}`;
    const data = await db.get(query)
    res.status(200).send(data)
});
