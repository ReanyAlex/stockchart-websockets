//Make connection
var socket = io.connect('http://localhost:3000');
let symbol = document.getElementById('symbol')
//emit event
document.getElementById('search').addEventListener('click', function(){
  console.log(symbol.value);
    socket.emit('add',{
      stockSymbol: symbol.value,
  })
});

function test(data){
  console.log(data);
  socket.emit('delete',{
    delete: data,
  })
}

//listen for events
socket.on('add', function(data){
  console.log('add',data);
  window.location.replace('/')
})

socket.on('delete', function(data){
  console.log('delete',data);
  window.location.replace('/')
})
