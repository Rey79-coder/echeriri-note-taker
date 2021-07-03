// const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const port = 3017

const fs = require('fs');
// const { func } = require('prop-types');

var rootObj = {root: __dirname + '/docs'};

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, '/docs')));



app.get('/', (req, res) => res.sendFile('/index.html', rootObj));

app.get('/notes', (req,res) => res.sendFile('/notes.html', rootObj));


app.get('/api/notes', (req, res) => {
    
    let json = getJson();
    res.json(json);
});

app.post('/api/notes', (req, res) => {
    addNoteToJSON(req.body);
    addNoteToJSON(req.body)
    res.json(getJson());
})

app.delete('/api/notes/:id', (req, res) => {
    deleteNoteFromJSON(req.params.id);
    res.json(getJson());
})

app.listen(port, () => console.log(`App listening at http://localhost:${port}`))

function getJson() {
    let data = fs.readFileSync(__dirname + '/data/db.json');
    let json = JSON.parse(data);

    return json;
}

function createNoteObject(data) {
    let obj = {title: data.title,
                text: data.text,
                complete: false,
                hidden: false}

     return obj
                
}

function addNoteToJSON(note) {
    let json = getJson();
    let newNote = createNoteObject(note);
    json.push(newNote);
    saveJSON(json);
}

function saveJSON(jsonData) {
    let data = JSON.stringify(jsonData);
    fs.writeFileSync(__dirname + '/data/db.json', data);
}

function deleteNoteFromJSON(id) {
    let json = getJson();
    json[id].hide = true
    saveJSON(json);
}