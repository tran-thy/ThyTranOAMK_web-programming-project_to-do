require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { query } = require('./helpers/db.js');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const port = process.env.PORT || 3001;

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// GET endpoint
app.get("/", async (req, res) => {
    try {
        const result = await query('SELECT * FROM tasks');
        const rows = result.rows ? result.rows : [];
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).json({ error: error.message });
    }
});

// POST endpoint
app.post("/new", async (req, res) => {
    try {
        const result = await query('INSERT INTO tasks (description) VALUES ($1) RETURNING *', [req.body.description]);
        res.status(200).json({ id: result.rows[0].id });
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE endpoint for deleting a task by ID
app.delete("/delete/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await query('DELETE FROM tasks WHERE id = $1', [id]);
        res.status(200).json({ id: id });
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});




// function openDB() {
//     const pool = new Pool({
//         user: 'postgres',
//         host: 'localhost',
//         database: 'todo',
//         password: 'root',
//         port: 5432
//     });
//     return pool;
// }

// My personal add - DELETE endpoint
// app.delete("/delete", (req, res) => {
//     res.header("Access-Control-Allow-Origin", "*"); // Set the CORS header
//     const taskId = req.body.id;
//     console.log("Deleting task with ID:", taskId); // Log task ID for debugging
//     pool.query('DELETE FROM tasks WHERE id = $1', [taskId], (error, result) => {
//         if (error) {
//             console.error("Error deleting task:", error); // Log the error for debugging
//             res.status(500).json({ error: "Error deleting task" }); // Send a generic error message
//         } else {
//             console.log("Task deleted successfully."); // Log success message for debugging
//             res.status(200).json({ success: true });
//         }
//     });
// });