#!/usr/local/bin/node

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

var app = express();
app.use(bodyParser.json());       // to support JSON-encoded bodies

app.get('/', function (req, res) {
    res.send('Hello from express.');
});

app.patch('/accounts/:id', function (req, res) {
    var field = req.body.field,
        action = req.body.action,
        amount = req.body.amount
        id = req.params.id;

    if (field != 'balance') {
        res.status(500).send({error: 'Unsupported field: ' + field});
    }
    else {
        switch(action){
        case 'credit':
            credit(id, amount, function (e) { res.status(500).send({error: e})});
            break;
        case 'charge':
            charge(id, amount, function (e) { res.status(500).send({error: e})});
            break;
        default:
            res.status(500).send({error: 'Unsupported action: ' + action});
        }
    }

    if (res.headersSent === false) {
        res.send('OK');
    }
});

app.post('/accounts', function (req, res) {
    console.log('someone called accounts to post!');
    console.log(req.body);
    res.send('post!');
});

app.listen(3000, function () {
    console.log('Service started on port 3000.');
});

function credit(id, amount, error) {
    console.log('called credit()', id, amount);
    // open file
    // check id
}

function charge(id, amount, error) {
    console.log('called charge()', id, amount);
    error('bad charge!');
}
