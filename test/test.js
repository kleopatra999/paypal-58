const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../api');
const expect = require('chai').expect;

chai.use(chaiHttp);

describe('Base scenario', function() {
    it('Should show api help for / GET', function(done) {
        chai.request(server)
        .get('/')
        .end(function(err, res){
            expect(res.text).to.have.string('Welcome to PayPal API');
            done();
        });
    });

    it('Should add an account Tom on /accounts POST', function(done) {
        chai.request(server)
        .post('/accounts')
        .send({"account":"4111111111111111", "name":"Tom", "limit":"1000"})
        .end(function(err, res){
            expect(res.status).to.equal(200);
            expect(res.text).to.equal('/accounts/4111111111111111');
            done();
            });
    });

    it('Should add an account Lisa on /accounts POST', function(done) {
        chai.request(server)
        .post('/accounts')
        .send({"account":"5454545454545454", "name":"Lisa", "limit":"3000"})
        .end(function(err, res){
            expect(res.status).to.equal(200);
            expect(res.text).to.equal('/accounts/5454545454545454');
            done();
            });
    });

    it('Should add an account Quincy on /accounts POST', function(done) {
        chai.request(server)
        .post('/accounts')
        .send({"account":"1234567890123456", "name":"Quincy", "limit":"2000"})
        .end(function(err, res){
            expect(res.status).to.equal(200);
            expect(res.text).to.equal('/accounts/1234567890123456');
            done();
            });
    });

    it('Should charge 500 on account Tom on /accounts:name PATCH', function(done) {
        chai.request(server)
        .patch('/accounts/Tom')
        .send({"field":"balance", "action":"charge", "amount":500})
        .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
            });
    });

    it('Should NOT charge 800 on account Tom because limit exceeded on /accounts:name PATCH', function(done) {
        chai.request(server)
        .patch('/accounts/Tom')
        .send({"field":"balance", "action":"charge", "amount":800})
        .end(function(err, res){
            expect(res.status).to.equal(500);
            expect(res.body.error).to.equal('Limit exceeded. Charge denied.');
            done();
            });
    });

    it('Should charge 7 on account Lisa on /accounts:name PATCH', function(done) {
        chai.request(server)
        .patch('/accounts/Lisa')
        .send({"field":"balance", "action":"charge", "amount":7})
        .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
            });
    });

    it('Should credit 100 on account Lisa on /accounts:name PATCH', function(done) {
        chai.request(server)
        .patch('/accounts/Lisa')
        .send({"field":"balance", "action":"credit", "amount":100})
        .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
            });
    });

    it('Should NOT credit 200 on account Quincy because invalid account on /accounts:name PATCH', function(done) {
        chai.request(server)
        .patch('/accounts/Quincy')
        .send({"field":"balance", "action":"credit", "amount":200})
        .end(function(err, res){
            expect(res.status).to.equal(500);
            expect(res.body.error).to.equal('Invalid account id: 1234567890123456 (Quincy)');
            done();
            });
    });

    it('Should summarize accounts correctly on /accounts GET', function(done) {
        chai.request(server)
        .get('/accounts')
        .end(function(err, res){
            expect(res.status).to.equal(200);
            expect(res.text).to.have.string('Lisa: $-93');
            expect(res.text).to.have.string('Quincy: error');
            expect(res.text).to.have.string('Tom: $500');
            done();
            });
    });
});
