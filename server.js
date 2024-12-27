
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


app.get('/',async(req,res)=>{
    res.send('server is working ..............')
})


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




app.post("/travel", (req, res) => {
    const { name, mobile, boarding, destination, email, date } = req.body;

    if (!name || !mobile || !boarding || !destination || !email || !date) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const query = `INSERT INTO travel (name, mobile, boarding, destination, email, date) VALUES ('${name}', '${mobile}', '${boarding}', '${destination}', '${email}', '${date}')`;
    db.run(query, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, message: "Travel record created successfully." });
    });
});