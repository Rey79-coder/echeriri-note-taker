// const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const port = 3017
const { db } = require('./data/db.json');
const fs = require('fs');
// const { func } = require('prop-types');

var rootObj = {root: __dirname + '/db'};

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, '/db')));



app.get('/', (req, res) => res.sendFile('/db', rootObj));

// app.get('/db', (req,res) => res.sendFile('/db', rootObj));


app.get('/api/db', (req, res) => {
    res.send('Hello!');
  });

// app.get('/api/db', (req, res) => {
    
//     let json = getJson();
//     res.json(json);
// });

app.post('/db', (req, res) => {
    addNoteToJSON(req.body);
    addNoteToJSON(req.body)
    res.json(getJson());
})

app.delete('/db:id', (req, res) => {
    deleteNoteFromJSON(req.params.id);
    res.json(getJson());
})

app.listen(port, () => console.log(`App listening at http://localhost:${port}`))

function getJson() {
    let data = fs.readFileSync(__dirname + '/db');
    let json = JSON.parse(data);

    return json;
}

function addNoteToJSON(note) {
    let json = getJson();
    let newNote = createNoteObject(note);
    json.push(newNote);
    saveJSON(json);
}

function saveJSON(jsonData) {
    let data = JSON.stringify(jsonData);
    fs.writeFileSync(__dirname + '/db', data);
}

function deleteNoteFromJSON(id) {
    let json = getJson();
    json[id].hide = true
    saveJSON(json);
}