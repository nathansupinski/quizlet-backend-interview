const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3000;

const jsonParser = bodyParser.json()

let nextId = 4;
const terms = [
    {
        id: 1,
        word: "Nebraska",
        definition: "Lincoln"
    },
    {
        id: 2,
        word: "Massachusetts",
        definition: "Boston"
    },
    {
        id: 3,
        word: "California",
        definition: "Sacramento"
    }
];

app.use(cors());

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/api/terms', (req, res) => {
    res.send(terms);
});

app.get('/api/terms/:id', (req, res) => {
    if(req.params.id){
        const term = terms.find((term) => term.id === +req.params.id)
        if(term){
            res.send(term);
            return;
        }
    }
    res.status(404).send('term not found')

});

app.post('/api/terms', jsonParser, (req, res) =>{
   if(req.body && req.body.word && req.body.definition){
       const newTerm = { ...req.body}
       newTerm.id = nextId;
       nextId++;
       terms.push(newTerm);
       res.send(newTerm);
       return;

   }

   return res.status(500).send('invalid term object');
});

app.put('/api/terms/:id', jsonParser, (req, res) =>{
    if(req.body && req.body.word && req.body.definition){
        const term = terms.find((term) => term.id === +req.params.id)
        if(term){
            term.word = req.body.word;
            term.definition = req.body.definition;
            res.send(term);
            return;
        }
        res.status(404).send('term not found. use post to add it');
        return;

    }

    return res.status(500).send('invalid term object');
});

app.delete('/api/terms/:id', jsonParser, (req, res) =>{
    const termIndex = terms.findIndex((term) => term.id === +req.params.id)
    if(termIndex > -1){
        terms.splice(termIndex, 1);
        res.status(200).send();
        return;
    }
    res.status(404).send('term not found. use post to add it');
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`));
