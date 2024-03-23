const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json()); // Add this line to parse JSON requests
const port = 3001;

const pool = openDB(); // Initialize connection pool

// GET endpoint
app.get("/", (req, res) => {
    pool.query('SELECT * FROM tasks', (error, result) => {
        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(200).json(result.rows);
        }
    });
});

// POST endpoint
app.post("/new", (req, res) => {
    const pool = openDB();

    pool.query('INSERT INTO tasks (description) VALUES ($1) RETURNING *', [req.body.description], (error, result) => {
        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(200).json({ id: result.rows[0].id });
        }
    });
});

// My personal add - DELETE endpoint
// DELETE endpoint
app.delete("/delete", (req, res) => {
    const taskId = req.body.id;
    console.log("Deleting task with ID:", taskId); // Log task ID for debugging
    pool.query('DELETE FROM tasks WHERE id = $1', [taskId], (error, result) => {
        if (error) {
            console.error("Error deleting task:", error); // Log the error for debugging
            res.status(500).json({ error: "Error deleting task" }); // Send a generic error message
        } else {
            console.log("Task deleted successfully."); // Log success message for debugging
            res.status(200).json({ success: true });
        }
    });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

function openDB() {
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'todo',
        password: 'root',
        port: 5432
    });
    return pool;
}
