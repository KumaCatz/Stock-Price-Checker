'use strict';
const bcrypt      = require('bcrypt');

module.exports = function ({ app, dbStocks }) {

  const api = 'https://stock-price-checker-proxy.freecodecamp.rocks/'

  app.route('/api/stock-prices')
    .get(async function (req, res){

      const {stock, like} = req.query
      const stocks = Array.isArray(stock) ? stock : [stock]

      try {
        //INSTRUCTIONS
        //check if theres a stock in the db with the same name.
        //if not, stock = create one
        //if yes, stock = the existing one
        //check in that stock if theres this machines ip address associated with it
        //if no, add to the ip addresses this one(hash).
        //if yes, continue
        //return the stock name, price and likes(rel if multiple)

        for (let singleStock of stocks) {
          console.log('inserting stock')
          const insertStock = await dbStocks.insertOne({
            'test': 123
          });
          console.log(insertStock)
          const response = await fetch(api + `v1/stock/${singleStock}/quote`);
          const data = await response.json();
          stockArray.push({
            stock: singleStock,
            price: data.latestPrice
          });
        }
        stockData = {'stockData': stockArray}

        console.log(stockData)

        if (req.query.vscodeBrowserReqId) {
          res.send(stockData.stockData)
        } else {
          res.send(stockData)
        }

      } catch (err) {
        res.send(err)
      }

    });
    
};
