const express = require("express");
const { query } = require("../helpers/db.js");

const todoRouter = express.Router();

todoRouter.get("/", async(req, res) => {
    try {
        const result = await query("SELECT * FROM tasks");
        const rows = result.rows ? result.rows : [];
        res.status(200).json(rows);
    } catch (error) {
        res.statusMessage = error;
        res.status(500).json({ error: error });
    }
});

todoRouter.post('/new', async(req, res) => {
    try {
        const result = await query(
            "INSERT INTO tasks (description) VALUES ($1) RETURNING *", [req.body.description]
        );
        res.status(200).json({ id: result.rows[0].id });
    } catch (error) {
        console.error(error);
        res.statusMessage = error;
        res.status(500).json({ error: error });
    }
});

todoRouter.delete("/delete/:id", async(req, res) => {
    const id = Number(req.params.id);
    try {
        const result = await query("DELETE FROM tasks WHERE id = $1", [id]);
        res.status(200).json({ id: id });
    } catch (error) {
        console.error(error);
        res.statusMessage = error;
        res.status(500).json({ error: error.message });
    }
});

module.exports = { todoRouter };