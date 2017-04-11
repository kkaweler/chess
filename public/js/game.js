var map = [];
function Game() {
    for (let i = 0; i < 8; i++) {
        map.push([]);
        for (let j = 0; j < 8; j++) {
            map[i][j] = null;
        }
    }
    this.drawField = function (newMap) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                map[i][j] = null;
                if (newMap[i][j] !== null) {
                    let element = document.getElementById('field-cell-' + i + j);
                    element.className = "";
                    element.classList.add(newMap[i][j].type);
                    element.classList.add('not-empty-sell');
                    element.classList.add(newMap[i][j].color);
                    switch (newMap[i][j].type) {
                        case 'pawn':
                            map[i][j] = new Pawn(newMap[i][j].color, {x: j, y: i});
                            if (newMap[i][j].moved) map[i][j].SetMoved();
                            break;
                        case 'knight':
                            map[i][j] = new Knight(newMap[i][j].color, {x: j, y: i});
                            break;
                        case 'rock':
                            map[i][j] = new Rock(newMap[i][j].color, {x: j, y: i});
                            break;
                        case 'bishop':
                            map[i][j] = new Bishop(newMap[i][j].color, {x: j, y: i});
                            break;
                        case 'queen':
                            map[i][j] = new Queen(newMap[i][j].color, {x: j, y: i});
                            break;
                        case 'king':
                            map[i][j] = new King(newMap[i][j].color, {x: j, y: i});
                            break;
                    }
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

socket.emit('start new game');
socket.on('new map', function (newMap) {
    game.drawField(newMap);
});

socket.on('update map', function (from, to) {
    map[from.y][from.x].Move(to);
});

window.onload = function () {
    mainDiv = document.createElement('div');
    mainDiv.className = 'main-field';
    var blackColor = '#9e9e9e';
    var doBlack = false;
    for (let i = 7; i >= 0; i--) {
        for (let j = 0; j < 8; j++) {
            let element = document.createElement('div');
            element.id = 'field-cell-' + i + j;
            element.dataset.x = j;
            element.dataset.y = i;
            element.onclick = function () {
                let data = this.dataset;
                let id = this.id;
                DeleteHighlighted();
                if (map[data.y][data.x] !== null) {
                    let highlight = map[data.y][data.x].GetMoves();
                    highlight.forEach(function (item) {
                        let el = document.createElement('div');
                        el.classList.add('highlighted');
                        el.style.position = "absolute";
                        el.dataset.parent = id;
                        el.dataset.x = item.x;
                        el.dataset.y = item.y;
                        el.onclick = function () {
                            let parent = document.getElementById(this.dataset.parent).dataset;
                            socket.emit('try move', {x: parent.x, y: parent.y}, {x: this.dataset.x, y: this.dataset.y});
                        }
                        let tmp = document.getElementById('field-cell-' + item.y + item.x);
                        el.style.left = tmp.offsetLeft + 'px';
                        el.style.top = tmp.offsetTop + 'px';
                        document.body.appendChild(el);
                    });
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
}
