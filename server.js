const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util")
const notes = require("./db/db.json");
const uuid = require("uuid");
const { DH_CHECK_P_NOT_SAFE_PRIME, SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");

// HANDLING ASYNCHRONOUS PROCESSES
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const app = express();
var PORT = process.env.PORT || 3017;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// STATIC MIDDLEWARE
app.use(express.static("./public"));



//Setting API's ROUTES
// GET API
app.get("/api/notes", function(req, res) {
    readFileAsync("./db/db.json", "utf8").then(function(data) {
        notes = [].concat(JSON.parse(data))
        res.json(notes);
    });
})

// POST API
app.post("/api/notes", function(req, res) {
    const note = req.body;
    readFileAsync("./db/db.json", "utf8").then(function(data) {
        const notes = [].concat(JSON.parse(data));
        note.id = notes.length + 1
        notes.push(notes);
            return notes
    }).then(function(notes) {
        writeFileAsync("./db/db.json", JSON.stringify(notes))
        res.json(notes);
    })
});

// DELETE API

app.delete("/api/note/:id", function(req, res) {
    const idToDelete = parseInt(req.params.id);
    readFileAsync("./db/db.json", "utf8").then(function(data) {
        const notes = [].concat(JSON.parse(data));
        const newNotesData = []
        for (let i = 0; i<notes.length; i++) {
            if(idToDelete !== notes[i].id) {
                newNotesData.push(notes[i])
            }
        }
        return newNotesData
        }).then(function(notes) {
            writeFileAsync("./db/db.json", JSON.stringify(notes))
            res.send("success!");

        })
    })

// HTML ROUTES
app.get("/notes", function(red, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
});

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("*", function(red, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// PORT LISTENING

//Start listen
app.listen(PORT, function () {
    console.log("App listening on PORT: " + PORT);
});

// //GET API db.json
// app.get("/api/notes", (req, res) => {
//     res.sendFile(path.join(__dirname, "./db/db.json"))
// });

// // Post function to add new notes to db.json
// app.post("/api/notes", (req, res) => {
//     const notes = JSON.parse(fs.readFileSync("./db/db.json"));
//     const newNotes = req.body;
//     newNotes.id = uuid.v4();
//     notes.push(newNotes);
//     fs.writeFileSync("./db/db.json", JSON.stringify(notes))
//     res.json(notes);
// });

// //used for deleting notes
// app.delete("/api/notes/:id", (req, res) => {
//     const notes = JSON.parse(fs.readFileSync("./db/db.json"));
//     const delNote = notes.filter((rmvNote) => rmvNote.id !== req.params.id);
//     fs.writeFileSync("./db/db.json", JSON.stringify(delNote));
//     res.json(delNote);
// })


// //HTML calls
// //calls home page
// app.get("/", function (req, res) {
//     res.sendFile(path.join(__dirname, "./public/index.html"));
// });
// //call for notes.html
// app.get("/notes", function (req, res) {
//     res.sendFile(path.join(__dirname, "./public/index.html"));
// });

// //Start listen
// app.listen(PORT, function () {
//     console.log("App listening on PORT: " + PORT);
// });
