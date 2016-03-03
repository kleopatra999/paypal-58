#!/usr/local/bin/node

const readline = require('readline');
const request = require('ajax-request');


const rl = readline.createInterface({
    input: process.stdin,
    output: null
});

rl.on('line', function(line) {
    // console.log(line);
    var cmd = line.split(/\s+/),
        action = cmd[0];

    switch(action) {
    case 'Add':
        addAction(cmd[1], cmd[2], cmd[3]);
        break;
    case 'Charge':
        chargeAction(cmd[1], cmd[2]);
        break;
    case 'Credit':
        creditAction(cmd[1], cmd[2]);
        break;
    default:
        console.log('Unknown action: ' + action);
    }
});

rl.on('close', function() {
    summaryAction();
});

function addAction(name, account, limit) {
    // POST /accounts
    request.post(
        {
            url: 'http://localhost:3000/accounts',
            data: {
                "account": account,
                "name": name,
                "limit": getAmountNumber(limit),
                "balance": 0
            },
            headers: {
                "Content-Type": "application/json"
            }
        },
        function(err, res, body) {
            if (err) console.log(err);
        }
    );
}

function creditAction(name, amount) {
    balanceAction('credit', name, amount);
}

function chargeAction(name, amount) {
    balanceAction('charge', name, amount);
}

function balanceAction(action, name, amount) {
    // PATCH /accounts/:name
    // [{"field": "balance", "action": action, "amount": amount}]
    var amountNumber = getAmountNumber(amount);

    request(
        {
            url: 'http://localhost:3000/accounts/' + name,
            method: 'PATCH',
            data: {
                "field": "balance",
                "action": action,
                "amount": amountNumber
            }
        },
        function(err, res, body) {
            if (err) {
                // Spec says not to show error
                // console.log(err);
            }
        }
    );
}

function summaryAction() {
    // GET /summary
    request(
        'http://localhost:3000/accounts',
        function(err, res, body) {
            if (err) {
                console.log(err);
            } else {
                console.log(body);
            }
        }
    );
}


function getAmountNumber(amount) {
    var amountComponenets = /^([^\d]+)(\d*)$/.exec(amount),
        denomination = amountComponenets[1],
        amountNumber = amountComponenets[2];
    return parseInt(amountNumber);
}


