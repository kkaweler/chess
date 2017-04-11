let express = require('express');
let app = express();
let io = require('socket.io')(3000);
let cookieSession = require('cookie-session');

app.use(express.static('public'));

app.set('trust proxy', 1);
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}))

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/templates/index.html');
});

app.listen(80, function () {
    console.log('Ready to rock!');
});
var sessions = {};
io.on('connection', function (socket) {
    socket.on('test', function () {
        console.log('hui');
    });

});
