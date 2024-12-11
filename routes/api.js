'use strict';
const bcrypt      = require('bcrypt');

const api = 'https://stock-price-checker-proxy.freecodecamp.rocks/'

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
//       //Anonymize IP
// app.use(async (req, res, next) => {
//   try {
//     await client.connect();
//     const hashedIp = await bcrypt.hash(req.ip, 10)
//     await db.collection('users.user').insertOne({
//       hashedIp
//     });
//     next()  
//   } catch(err) {
//     console.error('Error hashing IP:', err);
//     res.status(500).send('Server error');
//   }
// })

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

        const stockArray = []
        for (let singleStock of stock) {
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
