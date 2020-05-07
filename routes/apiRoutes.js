const fs = require("fs");
const util = require("util");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync =util.promisify(fs.writeFile);

module.exports = function(app) {
    
    app.get("/api/notes", async function(req, res) {
        let data = await readFileAsync("db/db.json", "utf8");
        
        res.json(JSON.parse(data));
    });

    app.post("/api/notes", async function(req, res) {
        let string = await readFileAsync("db/db.json", "utf8");
        let array = JSON.parse(string);
        array.push(req.body);

        let data = JSON.stringify(array);


        writeFileAsync("db/db.json", data, function(err) {
            if (err) throw err;
            console.log("success!");
        })
    })
}





