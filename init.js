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

function deepCloning(startObject) {
    var newObject = {};
    for (var firstKey in startObject) {
        var innerObject = {};
        var objectProperty = startObject[firstKey];
        if (typeof(objectProperty) == "object") {
            for (var secondKey in objectProperty) {
                innerObject[secondKey] = objectProperty[secondKey];
            }
        }
        else {
            innerObject = objectProperty;
        }
        newObject[firstKey] = innerObject;
    }
    return newObject;
}

io.on('connection', function (socket) {
    let currSession = socket.handshake.session;

    socket.on('start new game', function () {
        if (gamesInSearch.length == 0) {
            games[gameIDGen] = {};
            games[gameIDGen].game = new chess.Game();
            games[gameIDGen].history = [];
            games[gameIDGen].history.push({game: deepCloning(games[gameIDGen].game)});
            games[gameIDGen].players = {};
            currSession.gameID = gameIDGen;
            currSession.role = 'white';
            gamesInSearch.push(gameIDGen++)
        } else {
            let tmpID = gamesInSearch[0];
            if (currSession.gameID != tmpID) {
                currSession.role = 'black';
                currSession.gameID = tmpID;
                gamesInSearch.shift();
            }
        }
        games[currSession.gameID].players[currSession.role] = {id: socket.client.id};
        io.to(socket.client.id).emit('new map', games[currSession.gameID].game.map, currSession.role);
        io.to(socket.client.id).emit('set history', games[currSession.gameID].history);
        currSession.save();

        if (typeof games[currSession.gameID] != 'undefined')
            if (typeof games[currSession.gameID].game.turn != 'undefined')
                io.to(socket.client.id).emit('set turn', games[currSession.gameID].game.turn);

    });

    socket.on('try move', function (from, to) {
        let currMatch = games[currSession.gameID];
        try {
            if (currMatch.game.map[from.y][from.x] != null) {
                let lastMove = currMatch.history.slice(-1).pop();
                currMatch.game.Move(from, to, lastMove, function (moved) {
                    if (moved) {
                        let historyEl = {
                            from: from,
                            to: to,
                            type: currMatch.game.map[to.y][to.x].GetType(),
                            game: deepCloning(currMatch.game)
                        };
                        currMatch.history.push(historyEl);
                        for (let player in currMatch.players) {
                            io.to(currMatch.players[player].id).emit('update map', from, to);
                            io.to(currMatch.players[player].id).emit('update history', historyEl);
                            if (typeof lastMove != 'undefined')
                                if (typeof lastMove.to != 'undefined') {
                                    if (currMatch.game.map[lastMove.to.y][lastMove.to.x] == null) {
                                        io.to(currMatch.players[player].id).emit('clear cell', lastMove.to);
                                    }
                                }
                        }
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('turn', function () {
        let currMatch = games[currSession.gameID];
        try {
            currMatch.game.turn = currMatch.game.turn == 'white' ? 'black' : 'white';
            let lastMove = currMatch.history.slice(-1).pop();
            currMatch.game.GetMovesColor(lastMove, function (res) {
                console.log(res);
                let message = '';
                if(res == 'check') message = 'Check ' + currMatch.game.turn;
                if(res == 'mate') message = 'Mate' + (currMatch.game.turn == 'white' ? 'black' : 'white') + ' win!' ;

                for (let player in currMatch.players) {
                    io.to(currMatch.players[player].id).emit('set turn', currMatch.game.turn, message);
                }
            });
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('morph', function (pawn, to) {
        let currMatch = games[currSession.gameID];
        try {
            if (currMatch.game.map[pawn.y][pawn.x].GetType() == 'pawn') {
                currMatch.game.Morph(currMatch.game.map[pawn.y][pawn.x], to);
                let historyEl = {type: 'morph', from: pawn, to: to, game: deepCloning(currMatch.game)};
                currMatch.history.push(historyEl);
                for (let player in currMatch.players) {
                    io.to(currMatch.players[player].id).emit('update morph', pawn, to);
                    io.to(currMatch.players[player].id).emit('update history', historyEl);
                }
            }

        } catch (error) {
            console.log(error);
        }
    });

    socket.on('get moves', function (from) {
        let currMatch = games[currSession.gameID];
        try {
            currMatch.game.GetMoves(from, currMatch.history.slice(-1).pop(), function (moves) {
                io.to(socket.client.id).emit('highlight', moves, from.id);
            })
        } catch (error) {
            console.log(error);
        }
    });
});


server.listen(80);

