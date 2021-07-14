//import TermService from "./services/term.service.js";
import express, {request} from 'express';
//const express = require('express');
const app = express();
//const bodyParser = require('body-parser');
import bodyParser from "body-parser";
const jsonParser = bodyParser.json()
// const cors = require('cors');
// app.use(cors());
const port = 3000;

debugger;
const servers = [ 'api1', 'api2', 'db1', 'db2', 'web4']

const activeServerPool = {
    'api1': { index: 0},
    'api2': { index: 1},
    'db1': { index: 2},
    'db2': { index: 3},
    'web4': { index: 4}
}

const allocate = function (serverList, serverType){
    let serverId = 1;
    let validServerIdFound = false;
    while(!validServerIdFound){
        const possibleServerName = serverType + serverId
        if(!isAllocated(activeServerPool, possibleServerName)){
            addServer(serverList, activeServerPool, possibleServerName);
            validServerIdFound = true;
            return { serverName: possibleServerName};
        }
        serverId++;
    }

}

const deallocate = function (serverList, serverName) {
    if(isAllocated(activeServerPool, serverName)){
        removeServer(serverList, activeServerPool, serverName);
        return true;
    }
    return false;
}

const addServer = function (serverList, activeServerPool, serverName){
    serverList.push(serverName)
    activeServerPool[serverName] = {index: serverList.length - 1};
}

const isAllocated = function (activeServerPool, serverName){
    //console.log('isAllocated:', serverName);
    //console.log(activeServerPool[serverName]);
    return activeServerPool[serverName]
}

const removeServer = function(serverList, activeServerPool, serverName){
    let index = serverList.findIndex((server)=>{
        return server === serverName
    })
    delete activeServerPool[serverName];
    //console.log('index to remove', index)
    serverList.splice(index, 1);
}

console.log('starting...');
console.log('add api');
allocate(servers, 'api');
console.log(servers.toString());

console.log('add search');
allocate(servers, 'search');
console.log(servers.toString());

console.log('remove api2');
deallocate(servers, 'api2');
console.log(servers.toString());

console.log('remove web1');
deallocate(servers, 'web1');
console.log(servers.toString());

console.log('remove search1');
deallocate(servers, 'search1');
console.log(servers.toString());

console.log('add web');
allocate(servers, 'web');
console.log(servers.toString());


//console.log(activeServerPool.toString());

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/api/allocate', jsonParser, (req, res) =>{
    if(req.body && req.body.serverType){
        let serverType = req.body.serverType;
        let serverObj = allocate(servers, serverType)
        res.send(serverObj)
        return;
    }

    res.status(422).send('invalid body');
});

app.delete('/api/deallocate/:id', (req, res) => {
    let serverName = req.params.id;
    let deleted = deallocate(servers, serverName);
    if(deleted){
        res.status(200).send();
        return
    }else {
        res.status(404).send('server not found');
        return;
    }
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));