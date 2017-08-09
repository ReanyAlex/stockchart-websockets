//Make connection
//dev
// var socket = io.connect('http://localhost:3000');
//deployed
var socket = io.connect('https://mysterious-waters-64686.herokuapp.com/');

let symbol = document.getElementById('symbol')
//emit event
document.getElementById('search').addEventListener('click', function(){
    socket.emit('add',{
      stockSymbol: symbol.value
  })
});

function test(data){
  socket.emit('delete',{
    delete: data
  })
}

//listen for events
socket.on('add', function(data){
  window.location.replace('/')
})

socket.on('delete', function(data){
  window.location.replace('/')
})
