require("dotenv").config();
module.exports = {
    DB_PATH: "./data/",
    JWT_SECRET: process.env.JWT_SECRET || "supersecuresecret"
};
