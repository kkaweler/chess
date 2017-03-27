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
                this.coords = coords;
                return true;
            }
        return false;
    }

}

function Pawn(color, position) {
    this.prototype = Object.create(Figure.prototype);
    this.type = 'pawn';
    Figure.apply(this, arguments);
    this.GetMoves = function () {
        var array = [];
        var direction = this.color == 'white' ? 1 : -1;
        if (this.coords.x + 1 < 8 && (this.coords.y + direction >= 0 && this.coords.y + direction < 8))
            array.push({x: this.coords.x + 1, y: this.coords.y + direction});
        if (this.coords.x - 1 >= 0 && (this.coords.y + direction >= 0 && this.coords.y + direction < 8))
            array.push({x: this.coords.x - 1, y: this.coords.y + direction});
        return array;
    }
}

function Knight(color, position) {
    this.prototype = Object.create(Figure.prototype);
    this.type = 'knight';
    Figure.apply(this, arguments);
    this.GetMoves = function () {
        var array = [];
        if (this.coords.x - 1 > 0 && this.coords.y + 3 < 8)
            array.push({x: this.coords.x - 1, y: this.coords.y + 3});
        if (this.coords.x - 1 > 0 && this.coords.y - 3 < 8)
            array.push({x: this.coords.x - 1, y: this.coords.y + 3});
        if (this.coords.x + 1 > 0 && this.coords.y + 3 < 8)
            array.push({x: this.coords.x - 1, y: this.coords.y + 3});
        if (this.coords.x + 1 > 0 && this.coords.y - 3 < 8)
            array.push({x: this.coords.x - 1, y: this.coords.y + 3});
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
            array.push(toInsert);
            if (map[toInsert.y][toInsert.x] !== null)
                break;
        }
        for (var x = this.coords.x - 1; x >= 0; x--) {
            var toInsert = {x: x, y: this.coords.y};
            array.push(toInsert);
            if (map[toInsert.y][toInsert.x] !== null)
                break;
        }
        for (var y = this.coords.y + 1; y < 8; y++) {
            var toInsert = {x: this.coords.x, y: y};
            array.push(toInsert);
            if (map[toInsert.y][toInsert.x] !== null)
                break;
        }
        for (var y = this.coords.y - 1; y >= 0; y--) {
            var toInsert = {x: this.coords.x, y: y};
            array.push(toInsert);
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
        for (var x = this.coords.x + 1, y = this.coords.y; x < 8; x++, y++) {
            array.push({x: x, y: y});
            if (map[y][x] !== null)
                break;
        }
        for (var x = this.coords.x + 1, y = this.coords.y; x < 8; x++, y--) {
            array.push({x: x, y: y});
            if (map[y][x] !== null)
                break;
        }
        for (var x = this.coords.x - 1, y = this.coords.y; x >= 0; x--, y++) {
            array.push({x: x, y: y});
            if (map[y][x] !== null)
                break;
        }
        for (var x = this.coords.x - 1, y = this.coords.y; x >= 0; x--, y--) {
            array.push({x: x, y: y});
            if (map[y][x] !== null)
                break;
        }
        return array;
    }
}

function Queen(color, position) {
    this.prototype = Object.create(Figure.prototype);
    this.type = 'queen';
    Figure.apply(this, arguments);
    this.GetMoves = function () {
        var array = [];

        for (var x = this.coords.x + 1, y = this.coords.y; x < 8; x++, y++) {
            array.push({x: x, y: y});
            if (map[y][x] !== null)
                break;
        }
        for (var x = this.coords.x + 1, y = this.coords.y; x < 8; x++, y--) {
            array.push({x: x, y: y});
            if (map[y][x] !== null)
                break;
        }
        for (var x = this.coords.x - 1, y = this.coords.y; x >= 0; x--, y++) {
            array.push({x: x, y: y});
            if (map[y][x] !== null)
                break;
        }
        for (var x = this.coords.x - 1, y = this.coords.y; x >= 0; x--, y--) {
            array.push({x: x, y: y});
            if (map[y][x] !== null)
                break;
        }

        for (var x = this.coords.x + 1; x < 8; x++) {
            var toInsert = {x: x, y: this.coords.y};
            array.push(toInsert);
            if (map[toInsert.y][toInsert.x] !== null)
                break;
        }
        for (var x = this.coords.x - 1; x >= 0; x--) {
            var toInsert = {x: x, y: this.coords.y};
            array.push(toInsert);
            if (map[toInsert.y][toInsert.x] !== null)
                break;
        }
        for (var y = this.coords.y + 1; y < 8; y++) {
            var toInsert = {x: this.coords.x, y: y};
            array.push(toInsert);
            if (map[toInsert.y][toInsert.x] !== null)
                break;
        }
        for (var y = this.coords.y - 1; y >= 0; y--) {
            var toInsert = {x: this.coords.x, y: y};
            array.push(toInsert);
            if (map[toInsert.y][toInsert.x] !== null)
                break;
        }

        return array;
    }
}

function King(color, position) {
    this.prototype = Object.create(Figure.prototype);
    this.type = 'king';
    Figure.apply(this, arguments);
    this.GetMoves = function () {
        var array = [];
        if (this.coords.x + 1 < 8)
            array.push({x: this.coords.x + 1, y: this.coords.y});
        if (this.coords.x - 1 >= 0)
            array.push({x: this.coords.x - 1, y: this.coords.y});
        if (this.coords.y + 1 < 8)
            array.push({x: this.coords.x, y: this.coords.y + 1});
        if (this.coords.y - 1 >= 0)
            array.push({x: this.coords.x, y: this.coords.y - 1});
        if (this.coords.x + 1 < 8 && this.coords.y + 1 < 8)
            array.push({x: this.coords.x + 1, y: this.coords.y + 1});
        if (this.coords.x + 1 < 8 && this.coords.y - 1 >= 0)
            array.push({x: this.coords.x + 1, y: this.coords.y - 1});
        if (this.coords.x - 1 >= 0 && this.coords.y + 1 < 8)
            array.push({x: this.coords.x - 1, y: this.coords.y + 1});
        if (this.coords.x - 1 < 8 && this.coords.y - 1 >= 0)
            array.push({x: this.coords.x - 1, y: this.coords.y - 1});
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
                    element.className = map[i][j].type + ' not-empty-sell ' + map[i][j].color;
                }
            }
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
        for (var j = 7; j >= 0; j--) {
            var element = document.createElement('div');
            element.id = 'field-cell-' + i + j;
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