const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    test('Viewing one stock: GET request to /api/stock-prices/', (done) => {
        chai
            .request(server)
            .get('/api/stock-prices?stock=GOOG')
            .end((err, res) => {
                assert.equal(res.status, 200)
                console.log(res.body)
                assert.deepEqual(res.body.stock, 'GOOG')
                assert.deepEqual(typeof res.body.price, 'number')
                assert.deepEqual(typeof res.body.likes, 'number')
                done()
            })
    })
    test('Viewing one stock and liking it: GET request to /api/stock-prices/', (done) => {
        chai
            .request(server)
            .get('/api/stock-prices?stock=GOOG&like=true')
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.deepEqual(res.body.stock, 'GOOG')
                assert.deepEqual(typeof res.body.price, 'number')
                assert.deepEqual(typeof res.body.likes, 'number')
                done()
            })
    })
    test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', (done) => {
        chai
            .request(server)
            .get('/api/stock-prices?stock=GOOG&like=true')
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.deepEqual(res.body.stock, 'GOOG')
                assert.deepEqual(typeof res.body.price, 'number')
                assert.deepEqual(typeof res.body.likes, 'number')
                done()
            })
    })
    test('Viewing two stocks: GET request to /api/stock-prices/', (done) => {
        chai
            .request(server)
            .get('/api/stock-prices?stock=GOOG&stock=MSFT')
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.deepEqual(res.body[0].stock, 'GOOG')
                assert.deepEqual(res.body[1].stock, 'MSFT')
                done()
            })
    })
    test('Viewing two stocks and liking them: GET request to /api/stock-prices/', (done) => {
        chai
            .request(server)
            .get('/api/stock-prices?stock=GOOG&stock=MSFT&like=true')
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.deepEqual(res.body[0].stock, 'GOOG')
                assert.deepEqual(res.body[1].stock, 'MSFT')
                assert.deepEqual(typeof res.body[0].rel_likes, 'number')
                assert.deepEqual(typeof res.body[1].rel_likes, 'number')
                done()
            })
    })
});
