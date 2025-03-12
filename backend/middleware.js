const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("./config");

function authenticateToken(req, res, next) {
    const token = req.header("Authorization");
    if (!token) return res.status(403).json({ error: "Access denied" });

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid token" });
    }
}

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

async function comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

function generateToken(user) {
    return jwt.sign(user, JWT_SECRET, { expiresIn: "1h" });
}

module.exports = { authenticateToken, hashPassword, comparePassword, generateToken };
