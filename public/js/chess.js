function Figure(newColor, position) {
    this.color = newColor;
    this.coords = position;

    this.Die = function () {
        this.remove();
    }

    this.Move = function (coords) {
        var posibleCoords = this.GetMoves();
        for (var i = 0; i < posibleCoords.length; i++)
            if (posibleCoords[i].x == coords.x && posibleCoords[i].y == coords.y) {
                var oldCoords =  this.coords;
                this.coords = coords;

                var oldObj = document.getElementById('field-cell-'+oldCoords.y+oldCoords.x),
                    newObj = document.getElementById('field-cell-'+coords.y+coords.x);

                newObj.className = "";
                oldObj.classList.forEach(function(item){
                    newObj.classList.add(item);
                });
                oldObj.className = "";

                if(this.type == 'pawn') this.moved = true;

                map[this.coords.y][this.coords.x] = this;
                map[oldCoords.y][oldCoords.x] = null;
                DeleteHighlighted();
                return true;
            }
        return false;
    }

}

function Pawn(color, position) {
    this.prototype = Object.create(Figure.prototype);
    this.type = 'pawn';
    this.moved = false;
    Figure.apply(this, arguments);
    this.GetMoves = function () {
        var array = [], direction = this.color == 'white' ? 1 : -1;
        var y = this.coords.y + direction, x = this.coords.x;

        if (y >= 0 && y < 8) {
            if (map[y][x] === null)
                array.push({x: x, y: y});
        }
        if (!this.moved) {
            if (y >= 0 && y < 8) {
                if (map[y + direction][x] === null && map[y][x] === null) {
                    array.push({x: x, y: y + direction});
                }
            }
        }

        if (x + 1 < 8 && (y >= 0 && y < 8)) {
            if (map[y][x + 1] !== null)
                if (map[y][x + 1].color != this.color)
                    array.push({x: x + 1, y: y});
        }

        if (x - 1 >= 0 && (y >= 0 && y < 8)) {
            if (map[y][x - 1] !== null)
                if (map[y][x - 1].color != this.color)
                    array.push({x: x - 1, y: y});
        }

        return array;
    }
}

function Knight(color, position) {
    this.prototype = Object.create(Figure.prototype);
    this.type = 'knight';
    Figure.apply(this, arguments);
    this.GetMoves = function () {
        var array = [];
        var y = y, x = this.coords.x;
        if (x - 1 >= 0 && y + 2 < 8)
            if (map[y + 2][x - 1] === null)
                array.push({x: x - 1, y: y + 2});
            else if (map[y + 2][x - 1].color != this.color)
                array.push({x: x - 1, y: y + 2});

        if (x - 1 >= 0 && y - 2 >= 0)
            if (map[y - 2][x - 1] === null)
                array.push({x: x - 1, y: y - 2});
            else if (map[y - 2][x - 1].color != this.color)
                array.push({x: x - 1, y: y - 2});

        if (x + 1 < 8 && y + 2 < 8)
            if (map[y + 2][x + 1] === null)
                array.push({x: x + 1, y: y + 2});
            else if (map[y + 2][x + 1].color != this.color)
                array.push({x: x + 1, y: y + 2});

        if (x + 1 < 8 && y - 2 >= 0)
            if (map[y - 2][x + 1] === null)
                array.push({x: x + 1, y: y - 2});
            else if (map[y - 2][x + 1].color != this.color)
                array.push({x: x + 1, y: y - 2});

        return array;
    }
}

function Rock(color, position) {
    this.prototype = Object.create(Figure.prototype);
    this.type = 'rock';
    Figure.apply(this, arguments);
    this.GetMoves = function () {
        var array = [];

        for (var x = this.coords.x + 1; x < 8; x++) {
            var toInsert = {x: x, y: this.coords.y};
            if (map[toInsert.y][toInsert.x] === null)
                array.push(toInsert);
            else if (map[toInsert.y][toInsert.x].color == this.color) break;
            else array.push(toInsert);
            if (map[toInsert.y][toInsert.x] !== null)
                break;
        }

        for (var x = this.coords.x - 1; x >= 0; x--) {
            var toInsert = {x: x, y: this.coords.y};
            if (map[toInsert.y][toInsert.x] === null)
                array.push(toInsert);
            else if (map[toInsert.y][toInsert.x].color == this.color) break;
            else array.push(toInsert);
            if (map[toInsert.y][toInsert.x] !== null)
                break;
        }

        for (var y = this.coords.y + 1; y < 8; y++) {
            var toInsert = {x: this.coords.x, y: y};
            if (map[toInsert.y][toInsert.x] === null)
                array.push(toInsert);
            else if (map[toInsert.y][toInsert.x].color == this.color) break;
            else array.push(toInsert);
            if (map[toInsert.y][toInsert.x] !== null)
                break;
        }

        for (var y = this.coords.y - 1; y >= 0; y--) {
            var toInsert = {x: this.coords.x, y: y};
            if (map[toInsert.y][toInsert.x] === null)
                array.push(toInsert);
            else if (map[toInsert.y][toInsert.x].color == this.color) break;
            else array.push(toInsert);
            if (map[toInsert.y][toInsert.x] !== null)
                break;
        }

        return array;
    }
}

function Bishop(color, position) {
    this.prototype = Object.create(Figure.prototype);
    this.type = 'bishop';
    Figure.apply(this, arguments);
    this.GetMoves = function () {
        var array = [];
        for (var x = this.coords.x + 1, y = this.coords.y + 1; x < 8; x++, y++) {
            if (y >= 0 && y < 8) {
                if (map[y][x] === null)
                    array.push({x: x, y: y});
                else if (map[y][x].color == this.color) break;
                else array.push({x: x, y: y});
                if (map[y][x] !== null)
                    break;
            }
        }
        for (var x = this.coords.x + 1, y = this.coords.y - 1; x < 8; x++, y--) {
            if (y >= 0 && y < 8) {
                if (map[y][x] === null)
                    array.push({x: x, y: y});
                else if (map[y][x].color == this.color) break;
                else array.push({x: x, y: y});
                if (map[y][x] !== null)
                    break;
            }
        }
        for (var x = this.coords.x - 1, y = this.coords.y + 1; x >= 0; x--, y++) {
            if (y >= 0 && y < 8) {
                if (map[y][x] === null)
                    array.push({x: x, y: y});
                else if (map[y][x].color == this.color) break;
                else array.push({x: x, y: y});
                if (map[y][x] !== null)
                    break;
            }
        }
        for (var x = this.coords.x - 1, y = this.coords.y - 1; x >= 0; x--, y--) {
            if (y >= 0 && y < 8) {
                if (map[y][x] === null)
                    array.push({x: x, y: y});
                else if (map[y][x].color == this.color) break;
                else array.push({x: x, y: y});
                if (map[y][x] !== null)
                    break;
            }
        }
        return array;
    }
}

function Queen(color, position) {
    this.prototype = Object.create(Figure.prototype);
    this.type = 'queen';
    Figure.apply(this, arguments);
    this.GetMoves = function () {
        var array = [],
            tmp = new Bishop('white', this.coords);

        tmp.GetMoves().forEach(function (item) {
            array.push(item);
        });

        tmp = new Rock('white', this.coords);
        tmp.GetMoves().forEach(function (item) {
            array.push(item);
        });

        delete (tmp);

        return array;
    }
}

function King(color, position) {
    this.prototype = Object.create(Figure.prototype);
    this.type = 'king';
    Figure.apply(this, arguments);
    this.GetMoves = function () {
        var array = [];

        if (this.coords.x + 1 < 8) {
            if (map[this.coords.y][this.coords.x + 1] === null)
                array.push({x: this.coords.x + 1, y: this.coords.y});
            else if (map[this.coords.y][this.coords.x + 1].color != this.color)
                array.push({x: this.coords.x + 1, y: this.coords.y});
        }

        if (this.coords.x - 1 >= 0) {
            if (map[this.coords.y][this.coords.x - 1] === null)
                array.push({x: this.coords.x - 1, y: this.coords.y});
            else if (map[this.coords.y][this.coords.x - 1].color != this.color)
                array.push({x: this.coords.x - 1, y: this.coords.y});
        }

        if (this.coords.y + 1 < 8) {
            if (map[this.coords.y + 1][this.coords.x] === null)
                array.push({x: this.coords.x, y: this.coords.y + 1});
            else if (map[this.coords.y + 1][this.coords.x].color != this.color)
                array.push({x: this.coords.x, y: this.coords.y + 1});
        }

        if (this.coords.y - 1 >= 0) {
            if (map[this.coords.y - 1][this.coords.x] === null)
                array.push({x: this.coords.x, y: this.coords.y - 1});
            else if (map[this.coords.y - 1][this.coords.x].color != this.color)
                array.push({x: this.coords.x, y: this.coords.y - 1});
        }

        if (this.coords.x + 1 < 8 && this.coords.y + 1 < 8) {
            if (map[this.coords.y + 1][this.coords.x + 1] === null)
                array.push({x: this.coords.x + 1, y: this.coords.y + 1});
            else if (map[this.coords.y + 1][this.coords.x + 1].color != this.color)
                array.push({x: this.coords.x + 1, y: this.coords.y + 1});
        }

        if (this.coords.x + 1 < 8 && this.coords.y - 1 >= 0) {
            if (map[this.coords.y - 1][this.coords.x + 1] === null)
                array.push({x: this.coords.x + 1, y: this.coords.y - 1});
            else if (map[this.coords.y - 1][this.coords.x + 1].color != this.color)
                array.push({x: this.coords.x + 1, y: this.coords.y - 1});
        }

        if (this.coords.x - 1 >= 0 && this.coords.y + 1 < 8) {
            if (map[this.coords.y + 1][this.coords.x - 1] === null)
                array.push({x: this.coords.x - 1, y: this.coords.y + 1});
            else if (map[this.coords.y + 1][this.coords.x - 1].color != this.color)
                array.push({x: this.coords.x - 1, y: this.coords.y + 1});
        }

        if (this.coords.x - 1 < 8 && this.coords.y - 1 >= 0) {
            if (map[this.coords.y - 1][this.coords.x - 1] === null)
                array.push({x: this.coords.x - 1, y: this.coords.y - 1});
            else if (map[this.coords.y - 1][this.coords.x - 1].color != this.color)
                array.push({x: this.coords.x - 1, y: this.coords.y - 1});
        }
        return array;
    }
}

var map = [];

function Game() {
    for (var i = 0; i < 8; i++) {
        map.push([]);
        for (var j = 0; j < 8; j++) {
            map[i][j] = null;
        }
    }
    for (var i = 0; i < 8; i++) {
        map[1][i] = new Pawn('white', {x: i, y: 1});
        map[6][i] = new Pawn('black', {x: i, y: 6});
        switch (i) {
            case 0:
            case 7:
                map[0][i] = new Rock('white', {x: i, y: 0});
                map[7][i] = new Rock('black', {x: i, y: 7});
                break;
            case 1:
            case 6:
                map[0][i] = new Knight('white', {x: i, y: 0});
                map[7][i] = new Knight('black', {x: i, y: 7});
                break;
            case 2:
            case 5:
                map[0][i] = new Bishop('white', {x: i, y: 0});
                map[7][i] = new Bishop('black', {x: i, y: 7});
                break;
            case 3:
                map[0][i] = new Queen('white', {x: i, y: 0});
                map[7][i] = new Queen('black', {x: i, y: 7});
                break;
            case 4:
                map[0][i] = new King('white', {x: i, y: 0});
                map[7][i] = new King('black', {x: i, y: 7});
                break;
        }
    }

    this.drawField = function () {
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                if (map[i][j] !== null) {
                    var element = document.getElementById('field-cell-' + i + j);
                    element.classList.add(map[i][j].type);
                    element.classList.add('not-empty-sell');
                    element.classList.add(map[i][j].color);
                }
            }
        }

    }
}

function DeleteHighlighted(){
    var highlight = document.getElementsByClassName('highlighted');
    if (highlight.length) {
        while (highlight.length > 0) {
            highlight[0].parentNode.removeChild(highlight[0]);
        }
    }
}

var mainDiv;
var game = new Game();
window.onload = function () {
    mainDiv = document.createElement('div');
    mainDiv.className = 'main-field';
    var blackColor = '#9e9e9e';
    var doBlack = false;
    for (var i = 7; i >= 0; i--) {
        for (var j = 0; j < 8; j++) {
            var element = document.createElement('div');
            element.id = 'field-cell-' + i + j;
            element.dataset.x = j;
            element.dataset.y = i;
            element.onclick = function () {
                var data = this.dataset;
                var id = this.id;
                DeleteHighlighted();
                if (map[data.y][data.x] !== null) {
                    var highlight = map[data.y][data.x].GetMoves();
                    highlight.forEach(function (item) {
                        var el = document.createElement('div');
                        el.classList.add('highlighted');
                        el.style.position = "absolute";
                        el.dataset.parent = id;
                        el.dataset.x = item.x;
                        el.dataset.y = item.y;
                        el.onclick = function () {
                            var parent = document.getElementById(this.dataset.parent).dataset;
                            map[parent.y][parent.x].Move({x: parseInt(this.dataset.x), y: parseInt(this.dataset.y)});
                        }
                        var tmp = document.getElementById('field-cell-' + item.y + item.x);
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
    game.drawField();

}