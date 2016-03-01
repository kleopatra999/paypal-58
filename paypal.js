#!/usr/local/bin/node

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: null
});

rl.on('line', function(line) {
    // console.log(line);
    var cmd = line.split(/\s+/),
        action = cmd[0];
    console.log(cmd);

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
    var summary = summaryAction();
    console.log(summary);
});

function addAction(name, account, limit) {
    console.log('Add!', name, account, limit);
    // POST /accounts
}

function chargeAction(name, amount) {
    console.log('Charge!', name, amount);
    // PATCH /accounts/{name}
    // [{"field": "balance", "action": "charge", "amount": amount}]
}

function creditAction(name, amount) {
    console.log('Credit!', name, amount);
    // PATCH /accounts/{name}
    // [{"field": "balance", "action": "credit", "amount": amount}]
}

function summaryAction() {
    console.log('Summary!');
    // GET /summary
    return [];
}



