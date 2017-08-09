const methodOverride  = require('method-override'),
      bodyParser      = require('body-parser'),
      mongoose        = require('mongoose'),
      express         = require('express'),
      socket          = require('socket.io')
      fetch           = require('node-fetch'),
      app             = express()

const Stocks = require("./models/stocks")

app.use(methodOverride("_method"))
app.set("view engine", "ejs")

let url = process.env.DATABASEURL || "mongodb://localhost/stock-chart"
mongoose.connect(url);

app.use(express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function(req, res) {

  Stocks.find({}, function(err, allStocks) {
    if (err) {
      console.log(err);
    }
    else {
      let symbols = []

      allStocks.forEach(function(symbol){
        symbols.push(symbol.stockSymbols);
      })

      let apiKey = 'K6MXIRAG7LP9MUAM'

      let fetchArrayVars = []

      symbols.forEach(function(symbol,i){
        let url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`
        fetchArrayVars[i] = fetch(url)
        .then((res) => res.json())
        .then(function(json) {
          return json
        })
      })

      Promise.all(fetchArrayVars)
      .then(values => {
        return values
      })
      .then(function(values) {
        res.render('index', {stocks: values, database: allStocks})
      })
    }
  })
});

let server = app.listen(process.env.PORT || 3000, process.env.IP, function() {
  console.log('StockChart is running!')
});

//Socket setup
var io = socket(server);

io.on('connection', function(socket){
  console.log('made socket connection');

  socket.on('add',function(data) {
    console.log('socket on emit',data.stockSymbol);

    Stocks.create({stockSymbols:data.stockSymbol}, function(err) {
      if (err) {
        console.log(err);
      }
    })

    io.sockets.emit('add', data);
  })

  socket.on('delete',function(data) {
    console.log('socket on emit delete_id',data.delete);

    Stocks.findByIdAndRemove(data.delete, function(err) {
      if (err) {
        console.log(err);
      }
    })

    io.sockets.emit('delete', data);
  })

})
