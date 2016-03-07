#!/usr/local/bin/node

const express = require('express');
const bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());       // to support JSON-encoded bodies

// To simplify, using in-memory data storage.
// Also, by using in-memory data storage, I was able to iterate faster
// because I didn't have to reset database between runs.
// Can use MongoDB or other data storage
// data.accounts - stores account id, name, limit, and balance
// data.names - needed to support charges and credits by name
var data = {
        accounts: {},
        names: {}
    };

app.get('/', function (req, res) {
    res.send(
        'Welcome to PayPal API\n' +
        'GET    /accounts       Get all accounts\n' +
        'POST   /accounts       Create new account, payload: {"account": "12345", "name":"Joe", "limit":"1000", "balance":"0"}\n' +
        'PATCH  /accounts/Joe   Update an account, payload: {"field":"balance", "action":"charge", "amount":"50"}\n'
    );
});

// GET /accounts - get account summary
app.get('/accounts', function (req, res) {
    var summary = '',
        keys = [],
        name,
        amount;
    for (var key in data.names) {
        keys.push(key);
    }
    keys.sort();
    for (var i=0; i<keys.length; i++) {
        name = keys[i];
        account = data.names[name];
        (isAccountValid(account))? amount = "$" + data.accounts[account].balance : amount = "error";
        summary += name + ": " + amount + "\n";
    }
    res.send(summary);
});

// POST /accounts - Create new account
// Using an object as a hash to ensure uniquie account ids
// No need to validate account ids here because summary must
//  include invalid account ads as well.
app.post('/accounts', function (req, res) {
    data.accounts[req.body.account] = {
        "name": req.body.name,
        "limit": req.body.limit,
        "balance": 0
    };

    data.names[req.body.name] = req.body.account;

    res.send('/accounts/' + req.body.account);
});

app.patch('/accounts/:name', function (req, res) {
    var field = req.body.field,
        action = req.body.action,
        amount = req.body.amount
        name = req.params.name,
        account = data.names[name],
        limit = 0,
        balance = 0;

    if (field != 'balance') {
        res.status(500).send({error: 'Unsupported field: ' + field});
        return;
    }

    if (false === isAccountValid(account)) {
        res.status(500).send({error: 'Invalid account id: ' + account + ' (' + name + ')'});
        return;
    }

    switch(action){
    case 'credit':
        data.accounts[account].balance -= amount;
        break;
    case 'charge':
        // Validate that limit is not exceeded
        limit = data.accounts[account].limit;
        balance = data.accounts[account].balance;
        if (balance + amount <= limit) {
            data.accounts[account].balance += amount;
        } else {
            res.status(500).send({error: 'Limit exceeded. Charge denied.'});
        }
        break;
    default:
        res.status(500).send({error: 'Unsupported action: ' + action});
    }

    if (res.headersSent === false) {
        res.send();
    }
});

app.listen(3000, function () {
    console.log('Service started on port 3000.');
});

// Utility functions.  Can move them to a lib.
function isAccountValid(account) {
    // Luhn algorithm from https://gist.github.com/ShirtlessKirk/2134376
    var luhnChk=function(a){return function(c){for(var l=c.length,b=1,s=0,v;l;)v=parseInt(c.charAt(--l),10),s+=(b^=1)?a[v]:v;return s&&0===s%10}}([0,2,4,6,8,1,3,5,7,9]);
    return luhnChk(account);
}

module.exports = app;
