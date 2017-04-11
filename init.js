let express = require('express');
let app = express();
let session = require("express-session")({
        secret: "my-secret",
        resave: true,
        saveUninitialized: true
    }),
    sharedsession = require("express-socket.io-session");

let chess = require(__dirname + '/chess.js');
app.use(express.static('public'));
app.set('trust proxy', 1);
app.use(session);
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/templates/index.html');
    req.session.test = 'test';
    req.session.save();
});

let server = require('http').createServer(app);

let io = require('socket.io')(server);
io.use(sharedsession(session));

let gameIDGen = 0;
let games = {};
let gamesInSearch = [];
let game = new chess.Game();

/*
TODO
1. Метаморфоза пешки
2. Передача хода
3. Повторное подключение
4. Рокировка
5. Шах
6. Мат
 */
io.on('connection', function (socket) {
    let currSession = socket.handshake.session;
    socket.on('start new game', function () {
        if (gamesInSearch.length == 0) {
            games[gameIDGen] = {};
            games[gameIDGen].map = game.Map();
            games[gameIDGen].turn = 'white';
            games[gameIDGen].history = [];
            games[gameIDGen].players = [];
            games[gameIDGen].players.push({id: socket.client.id, role: 'white'});
            currSession.gameID = gameIDGen;
            gamesInSearch.push(gameIDGen++)
        } else {
            let tmpID = gamesInSearch[0];
            if (currSession.gameID != tmpID) {
                games[tmpID].players.push({id: socket.client.id, role: 'black'});
                currSession.gameID = tmpID;
            }
        }
        io.to(socket.client.id).emit('new map', games[currSession.gameID].map);
        currSession.save();
    });

    socket.on('try move', function (from, to) {
        let game = games[currSession.gameID];
        try {
            if (game.map[from.y][from.x] != null)
                if (game.map[from.y][from.x].Move(to, game.map)) {
                    game.players.forEach(function (item) {
                        io.to(item.id).emit('update map', from, to);
                    });
                }
        } catch (error) {
            console.log(error);
        }
    });
});


server.listen(80);

