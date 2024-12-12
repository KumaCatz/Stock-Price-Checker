'use strict';
const bcrypt      = require('bcrypt');

const api     = 'https://stock-price-checker-proxy.freecodecamp.rocks/'
const salt    = 10

module.exports = function ({ app, dbStocks }) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
      // in case delete the db:
      // const result = await dbStocks.deleteMany();
      const {stock, like} = req.query
      const stocks = Array.isArray(stock) ? stock : [stock]
      try {
        const stockData = []
        for (let singleStock of stocks) {
          // format stock to lower letter
          const formStock = singleStock.toLowerCase()
          //check if theres a stock in the db with the same name.
          let dbStock = await dbStocks.findOne({'stock': formStock})
          if (!dbStock) {
            //create one with stock, price and likes
            dbStock = {
              'stock': formStock,
              'ip': []
            }
            const insertResult = await dbStocks.insertOne(dbStock);
          }
          if (like && JSON.parse(like)) {
            //check in that stock if theres this machines ip address associated with it
            const isIp = await Promise.all(
              dbStock.ip.map(async (ip) => {
                return bcrypt.compare(req.ip, ip);
              })
            ).then(results => results.some(result => result))
            //if not, hash the ip first
            if (!isIp) {
              const hashedIp = await bcrypt.hash(req.ip, salt)
              dbStock.ip.push(hashedIp)
              //add the hashed ip to the db stock
              const updatedStock = await dbStocks.updateOne(
                {'stock': formStock},
                {
                  $push: {
                    'ip': hashedIp
                  },
                }
              )
            }
          }
          // get price from api
          const response = await fetch(api + `v1/stock/${singleStock}/quote`);
          const data = await response.json();
          stockData.push({
            'stock': singleStock,
            'price': data.latestPrice,
            'likes': dbStock.ip.length
          })
        }
        if (stockData.length > 1) {
          const likesDifference = stockData[0].likes - stockData[1].likes;

          stockData[0].rel_likes = likesDifference;
          stockData[1].rel_likes = -likesDifference;
          delete stockData[0].likes;
          delete stockData[1].likes; 
        }
        //return the stock name, price and likes
        if (stockData.length === 1) {
          res.send({'stockData': stockData[0]})
        } else {
          res.send({'stockData': stockData})
        }

      } catch (err) {
        res.send(err)
      }

    });
};
