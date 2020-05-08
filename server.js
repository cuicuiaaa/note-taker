const express = require("express");
const app = express();
const { v4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const util = require("util");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

app.use(express.static('public'));

const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
})

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
})

app.get("/api/notes", async function(req, res) {
    let string = await readFileAsync("db/db.json", "utf8");

    res.json(JSON.parse(string));
    
    
});

app.post("/api/notes", async function(req, res) {
    let string = await readFileAsync("db/db.json", "utf8");

    let notes = JSON.parse(string);

    let newNote = req.body;
    let id = v4();
    newNote.id = id;
    
    notes.push(newNote);

    let data = JSON.stringify(notes);

    writeFileAsync("db/db.json", data, function(err) {
        if(err) throw err;
        console.log("success!");
    });

    res.send({
        status: 200,
        message: 'success!'
    });
    
    
    
});

app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
});
