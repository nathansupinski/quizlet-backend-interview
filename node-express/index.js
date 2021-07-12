import TermService from "./services/term.service.js";
import express from 'express';
//const express = require('express');
const app = express();
//const bodyParser = require('body-parser');
import bodyParser from "body-parser";
const jsonParser = bodyParser.json()
// const cors = require('cors');
// app.use(cors());
const port = 3000;



const termService = new TermService();


app.get('/', (req, res) => res.send('Hello World!'));

app.get('/api/terms', (req, res) => {
    res.send(termService.getTerms());
});

app.get('/api/terms/:id', (req, res) => {
    if(req.params.id){
        const term = termService.getTerm(req.params.id)
        if(term){
            res.send(term);
            return;
        }
    }
    res.status(404).send('term not found')

});

app.post('/api/terms', jsonParser, (req, res) =>{
   if(req.body && req.body.word && req.body.definition){
       const newTerm = termService.addTerm(req.body);
       res.send(newTerm);
       return;

   }

   return res.status(500).send('invalid term object');
});

app.put('/api/terms/:id', jsonParser, (req, res) =>{
    if(req.body && req.body.word && req.body.definition){
        const term = termService.updateTerm(req.params.id, req.body)
        if(term){
            res.send(term);
            return;
        }
        res.status(404).send('term not found. use post to add it');
        return;

    }

    return res.status(500).send('invalid term object');
});

app.delete('/api/terms/:id', jsonParser, (req, res) =>{
    const termDeleted = termService.deleteTerm(req.params.id);
    if(termDeleted){
        res.status(200).send();
        return;
    }
    res.status(404).send('term not found. use post to add it');
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`));
