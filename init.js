var express = require('express');

var app = express();
app.use(express.static('public'));

//var io = require('socket.io')(3000);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/templates/index.html');
});

app.listen(3000, function(){
    console.log('Ready too rock!');
});
