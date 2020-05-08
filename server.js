const express = require("express");
const app = express();
const { v4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const util = require("util");

const readFileAsync = util.promisify(fs.readFile);

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

app.get("/api/notes", function(req, res) {
    readFileAsync(path.join(__dirname, "db/db.json"), "utf8")
    .then(notes => {
        console.log(notes);
        res.json(JSON.parse(notes));
    })
    
});

app.post("/api/notes", function(req, res) {
    readFileAsync("db/db.json", "utf8", function(string) {
        let notes = JSON.parse(string);

        let newNote = req.body;
        let id = v4();
        newNote.id = id;
        
        notes.push(newNote);

        let data = JSON.stringify(notes);

        writeFileAsync("db/db.json", data, function() {
            if(err) throw err;
            console.log("success!");
        });
        
        res.send({
            status: 200,
            message: 'success!'
        });
    })
    
    
});

app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
});
