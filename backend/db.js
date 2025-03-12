const fs = require("fs");
const path = require("path");
const { DB_PATH } = require("./config");

if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(DB_PATH);
}

function getFilePath(collection) {
    return path.join(DB_PATH, `${collection}.json`);
}

function readCollection(collection) {
    const filePath = getFilePath(collection);
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "[]");
    return JSON.parse(fs.readFileSync(filePath));
}

function writeCollection(collection, data) {
    fs.writeFileSync(getFilePath(collection), JSON.stringify(data, null, 2));
}

async function insert(collection, data) {
    let records = readCollection(collection);
    data._id = Date.now().toString();
    records.push(data);
    writeCollection(collection, records);
    return data;
}

async function find(collection, query) {
    let records = readCollection(collection);
    return records.filter(item => Object.keys(query).every(key => item[key] === query[key]));
}

async function update(collection, query, newData) {
    let records = readCollection(collection);
    records = records.map(item =>
        Object.keys(query).every(key => item[key] === query[key]) ? { ...item, ...newData } : item
    );
    writeCollection(collection, records);
    return { updated: true };
}

async function remove(collection, query) {
    let records = readCollection(collection);
    const newRecords = records.filter(item => !Object.keys(query).every(key => item[key] === query[key]));
    writeCollection(collection, newRecords);
    return { deleted: true };
}

module.exports = { insert, find, update, remove };
