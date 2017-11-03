var map = [];
var player = {};
function Game() {
    for (let i = 0; i < 8; i++) {
        map.push([]);
        for (let j = 0; j < 8; j++) {
            map[i][j] = null;
        }
    }
    this.history = [];
    this.turn = 'white';
    this.markedCells = [];

    this.SetMarkedCells = function (newCells) {
        this.markedCells = newCells;
    }

    this.SetTurn = function (newTurn) {
        this.turn = newTurn;
    }

    this.GetTurn = function () {
        return this.turn;
    }

    this.SetHistory = function (history) {
        this.history = history;
    }

    this.UpdateHistry = function (el) {
        this.history.push(el);
    }

    this.LastTurn = function () {
        return this.history[this.history.length - 1];
    }

    this.CreateFigure = function (element, i, j) {
        var toReturn = null;
        switch (element.type) {
            case 'pawn':
                toReturn = new Pawn(element.color, {x: j, y: i});
                if (element.moved) toReturn.SetMoved();
                break;
            case 'knight':
                toReturn = new Knight(element.color, {x: j, y: i});
                break;
            case 'rock':
                toReturn = new Rock(element.color, {x: j, y: i});
                break;
            case 'bishop':
                toReturn = new Bishop(element.color, {x: j, y: i});
                break;
            case 'queen':
                toReturn = new Queen(element.color, {x: j, y: i});
                break;
            case 'king':
                toReturn = new King(element.color, {x: j, y: i});
                if (element.color == player.role)
                    player.king = toReturn;

        }
        return toReturn;
    };

    this.drawField = function (newMap) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                map[i][j] = null;
                if (newMap[i][j] !== null) {
                    let element = document.getElementById('field-cell-' + i + j);
                    element.className = "";
                    element.classList.add(newMap[i][j].type);
                    element.classList.add('not-empty-cell');
                    element.classList.add(newMap[i][j].color);
                    map[i][j] = this.CreateFigure(newMap[i][j], i, j);
                }
            }
        }

    }
}

function DeleteHighlighted() {
    let highlight = document.getElementsByClassName('highlighted');
    if (highlight.length) {
        while (highlight.length > 0) {
            highlight[0].parentNode.removeChild(highlight[0]);
        }
    }
}

var mainDiv;
var game = new Game();
var socket = io.connect();

window.onload = function () {
    socket.emit('start new game');
}

socket.on('new map', function (newMap, role) {
    player.role = role;
    mainDiv = document.createElement('div');
    mainDiv.className = 'main-field';
    var blackColor = '#9e9e9e';
    var doBlack = false;
    for (let i = role == 'white' ? 7 : 0; role == 'white' ? i >= 0 : i < 8; role == 'white' ? i-- : i++) {
        for (let j = role == 'white' ? 7 : 0; role == 'white' ? j >= 0 : j < 8; role == 'white' ? j-- : j++) {
            let element = document.createElement('div');
            element.id = 'field-cell-' + i + j;
            element.dataset.x = j;
            element.dataset.y = i;
            element.onclick = function () {
                let data = this.dataset;
                let id = this.id;
                DeleteHighlighted();
                if (map[data.y][data.x] !== null && player.role == game.GetTurn()) {
                    if (map[data.y][data.x].GetColor() == player.role) {
                        socket.emit('get moves', {y: data.y, x: data.x, id: id});
                    }
                }
            }
            if (doBlack) {
                element.style.backgroundColor = blackColor;
                doBlack = false;
            }
            else doBlack = true;
            mainDiv.appendChild(element);
        }
        doBlack = !doBlack;
    }
    document.body.appendChild(mainDiv);
    game.drawField(newMap);
});

socket.on('set turn', function (turn, message) {
    game.SetTurn(turn);
    if (message && message.length) alert(message);

});

socket.on('update map', function (from, to) {
    try {
        map[from.y][from.x].Move(to, game.GetTurn() != player.role);
    } catch (e) {
        console.log(e);
    }
});

socket.on('update morph', function (from, to) {
    try {
        map[from.y][from.x].Morph(to);
    } catch (e) {
        console.log(e);
    }
});

socket.on('clear cell', function (cell) {
    let element = document.getElementById('field-cell-' + cell.y + cell.x);
    element.className = "";
    map[cell.y][cell.x] = null;
});

socket.on('update history', function (el) {
    game.UpdateHistry(el);
});

socket.on('set history', function (history) {
    game.SetHistory(history);
});

socket.on('highlight', function (highlight, id) {
    highlight.forEach(function (item) {
        let el = document.createElement('div');
        el.classList.add('highlighted');
        el.style.position = "absolute";
        el.dataset.parent = id;
        el.dataset.x = item.x;
        el.dataset.y = item.y;
        el.onclick = function () {
            if (player.role == game.GetTurn()) {
                let parent = document.getElementById(this.dataset.parent).dataset;
                socket.emit('try move', {x: parent.x, y: parent.y}, {
                    x: this.dataset.x,
                    y: this.dataset.y
                });
            }
        }
        let tmp = document.getElementById('field-cell-' + item.y + item.x);
        el.style.left = tmp.offsetLeft + 'px';
        el.style.top = tmp.offsetTop + 'px';
        document.body.appendChild(el);
    });
});