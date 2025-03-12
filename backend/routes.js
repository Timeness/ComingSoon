const express = require("express");
const { insert, find, update, remove } = require("./db");
const { authenticateToken, hashPassword, comparePassword, generateToken } = require("./middleware");

const router = express.Router();

router.post("/insert", authenticateToken, async (req, res) => {
    const data = req.body;
    const result = await insert("myCollection", data);
    res.json(result);
});

router.get("/find", authenticateToken, async (req, res) => {
    const query = req.query;
    const result = await find("myCollection", query);
    res.json(result);
});

router.put("/update", authenticateToken, async (req, res) => {
    const { query, data } = req.body;
    const result = await update("myCollection", query, data);
    res.json(result);
});

router.delete("/delete", authenticateToken, async (req, res) => {
    const query = req.body;
    const result = await remove("myCollection", query);
    res.json(result);
});

router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const user = await insert("users", { username, password: hashedPassword });
    res.json(user);
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const users = await find("users", { username });

    if (users.length === 0) return res.status(400).json({ error: "User not found" });

    const validPassword = await comparePassword(password, users[0].password);
    if (!validPassword) return res.status(400).json({ error: "Invalid password" });

    const token = generateToken({ username });
    res.json({ token });
});

module.exports = router;
