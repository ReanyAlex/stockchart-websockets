const mongoose = require('mongoose');

var StockSchema = new mongoose.Schema({
  stockSymbols: String
});

module.exports = mongoose.model("Stocks", StockSchema);
