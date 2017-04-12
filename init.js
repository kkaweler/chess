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
 1. Метаморфоза пешки | done!
 2. Повторное подключение | done!
 3.1 Передача хода | testing
 3.2 История
 4. Пешка(пересечение пешкой удлинённого хода другой пешки)
 5. Рокировка
 6. Шах
 7. Мат
 */
io.on('connection', function (socket) {
    let currSession = socket.handshake.session;
    if (typeof games[currSession.gameID] != 'undefined')
        if (typeof games[currSession.gameID].turn != 'undefined')
            io.to(socket.client.id).emit('set turn', games[currSession.gameID].turn);

    socket.on('start new game', function () {
        if (gamesInSearch.length == 0) {
            games[gameIDGen] = {};
            games[gameIDGen].map = game.Map();
            games[gameIDGen].turn = 'white';
            games[gameIDGen].history = [];
            games[gameIDGen].players = {};
            currSession.gameID = gameIDGen;
            currSession.role = 'white';
            gamesInSearch.push(gameIDGen++)
        } else {
            let tmpID = gamesInSearch[0];
            if (currSession.gameID != tmpID) {
                currSession.role = 'black';
                currSession.gameID = tmpID;
            }
        }
        games[currSession.gameID].players[currSession.role] = {id: socket.client.id};
        io.to(socket.client.id).emit('new map', games[currSession.gameID].map, currSession.role);
        currSession.save();
    });

    socket.on('try move', function (from, to) {
        let currGame = games[currSession.gameID];
        try {
            if (currGame.map[from.y][from.x] != null)
                if (currGame.map[from.y][from.x].Move(to, currGame.map)) {
                    for (let player in currGame.players) {
                        io.to(currGame.players[player].id).emit('update map', from, to);
                    }
                }
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('turn', function () {
        let currGame = games[currSession.gameID];
        try {
            currGame.turn = currGame.turn == 'white' ? 'black' : 'white';
            for (let player in currGame.players) {
                io.to(currGame.players[player].id).emit('set turn', currGame.turn);
            }
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('morph', function (pawn, to) {
        let currGame = games[currSession.gameID];
        try {
            if (currGame.map[pawn.y][pawn.x].GetType() == 'pawn') {
                game.Morph(currGame.map[pawn.y][pawn.x], to, currGame.map);
                for (let player in currGame.players) {
                    io.to(currGame.players[player].id).emit('update morph', from, to);
                }
            }

        } catch (error) {
            console.log(error);
        }
    });
});


server.listen(80);

