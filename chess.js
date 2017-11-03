class Figure {
    constructor(newColor, position) {
        this.color = newColor;
        this.coords = position;
    }

    GetMoves() {
        this.coords.x = parseInt(this.coords.x);
        this.coords.y = parseInt(this.coords.y);
    }

    GetType() {
        return this.type;
    }

    GetCoords() {
        return this.coords;
    }

    GetColor() {
        return this.color;
    }

    Move(coords, map, lastmove) {
        let posibleCoords = this.GetMoves(map, lastmove);
        for (let i = 0; i < posibleCoords.length; i++)
            if (posibleCoords[i].x == coords.x && posibleCoords[i].y == coords.y) {
                let oldCoords = this.coords;
                this.coords = coords;
                map[this.coords.y][this.coords.x] = this;
                map[oldCoords.y][oldCoords.x] = null;
                if (this.type == 'pawn') {
                    this.moved = true;
                    if (posibleCoords[i].killFastPawn) {
                        let tmp = posibleCoords[i].killFastPawn;
                        map[tmp.y][tmp.x] = null;
                    }
                }
                if (this.type == 'king')
                    this.moved = true;
                return true;
            }
        return false;
    }

}

class Pawn extends Figure {
    constructor(color, position) {
        super(color, position);
        this.type = 'pawn';
        this.moved = false;
    }

    GetMoves(map, lastMove = undefined) {
        super.GetMoves();
        let array = [], direction = this.color == 'white' ? 1 : -1;
        let y = this.coords.y + direction, x = this.coords.x;

        if (typeof lastMove != 'undefined')
            if (lastMove.type == 'pawn' && this.coords.y == lastMove.to.y
                && Math.abs(lastMove.from.y - lastMove.to.y) == 2
                && Math.abs(lastMove.from.x - this.coords.x) == 1) {
                array.push({
                    x: lastMove.to.x,
                    y: lastMove.from.y > lastMove.to.y ? lastMove.from.y - 1 : lastMove.to.y - 1,
                    killFastPawn: lastMove.to
                });
            }

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
                if (map[y][x + 1].GetColor() != this.color)
                    array.push({x: x + 1, y: y});
        }

        if (x - 1 >= 0 && (y >= 0 && y < 8)) {
            if (map[y][x - 1] !== null)
                if (map[y][x - 1].GetColor() != this.color)
                    array.push({x: x - 1, y: y});
        }

        return array;
    }
}

class Knight extends Figure {

    constructor(color, position) {
        super(color, position);
        this.type = 'knight';
        this.check = false;
    }

    GetMoves(map) {
        super.GetMoves();
        let array = [];
        let y = this.coords.y, x = this.coords.x;
        if (x - 1 >= 0 && y + 2 < 8)
            if (map[y + 2][x - 1] === null)
                array.push({x: x - 1, y: y + 2});
            else if (map[y + 2][x - 1].GetColor() != this.color)
                array.push({x: x - 1, y: y + 2});

        if (x - 1 >= 0 && y - 2 >= 0)
            if (map[y - 2][x - 1] === null)
                array.push({x: x - 1, y: y - 2});
            else if (map[y - 2][x - 1].GetColor() != this.color)
                array.push({x: x - 1, y: y - 2});

        if (x + 1 < 8 && y + 2 < 8)
            if (map[y + 2][x + 1] === null)
                array.push({x: x + 1, y: y + 2});
            else if (map[y + 2][x + 1].GetColor() != this.color)
                array.push({x: x + 1, y: y + 2});

        if (x + 1 < 8 && y - 2 >= 0)
            if (map[y - 2][x + 1] === null)
                array.push({x: x + 1, y: y - 2});
            else if (map[y - 2][x + 1].GetColor() != this.color)
                array.push({x: x + 1, y: y - 2});

        if (y - 1 >= 0 && x + 2 < 8)
            if (map[y - 1][x + 2] === null)
                array.push({x: x + 2, y: y - 1});
            else if (map[y - 1][x + 2].GetColor() != this.color)
                array.push({x: x + 2, y: y - 1});

        if (y - 1 >= 0 && x - 2 >= 0)
            if (map[y - 1][x - 2] === null)
                array.push({x: x - 2, y: y - 1});
            else if (map[y - 1][x - 2].GetColor() != this.color)
                array.push({x: x - 2, y: y - 1});

        if (y + 1 < 8 && x + 2 < 8)
            if (map[y + 1][x + 2] === null)
                array.push({x: x + 2, y: y + 1});
            else if (map[y + 1][x + 2].GetColor() != this.color)
                array.push({x: x + 2, y: y + 1});

        if (y + 1 < 8 && x - 2 >= 0)
            if (map[y + 1][x - 2] === null)
                array.push({x: x - 2, y: y + 1});
            else if (map[y + 1][x - 2].GetColor() != this.color)
                array.push({x: x - 2, y: y + 1});

        return array;
    }
}

class Rock extends Figure {
    constructor(color, position) {
        super(color, position);
        this.type = 'rock';
    }

    GetMoves(map) {
        super.GetMoves();
        let array = [];

        for (let x = this.coords.x + 1; x < 8; x++) {
            let toInsert = {x: x, y: this.coords.y};
            if (map[toInsert.y][toInsert.x] === null)
                array.push(toInsert);
            else if (map[toInsert.y][toInsert.x].GetColor() == this.color) break;
            else array.push(toInsert);
            if (map[toInsert.y][toInsert.x] !== null)
                break;
        }

        for (let x = this.coords.x - 1; x >= 0; x--) {
            let toInsert = {x: x, y: this.coords.y};
            if (map[toInsert.y][toInsert.x] === null)
                array.push(toInsert);
            else if (map[toInsert.y][toInsert.x].GetColor() == this.color) break;
            else array.push(toInsert);
            if (map[toInsert.y][toInsert.x] !== null)
                break;
        }

        for (let y = this.coords.y + 1; y < 8; y++) {
            let toInsert = {x: this.coords.x, y: y};
            if (map[toInsert.y][toInsert.x] === null)
                array.push(toInsert);
            else if (map[toInsert.y][toInsert.x].GetColor() == this.color) break;
            else array.push(toInsert);
            if (map[toInsert.y][toInsert.x] !== null)
                break;
        }

        for (let y = this.coords.y - 1; y >= 0; y--) {
            let toInsert = {x: this.coords.x, y: y};
            if (map[toInsert.y][toInsert.x] === null)
                array.push(toInsert);
            else if (map[toInsert.y][toInsert.x].GetColor() == this.color) break;
            else array.push(toInsert);
            if (map[toInsert.y][toInsert.x] !== null)
                break;
        }

        return array;
    }
}

class Bishop extends Figure {
    constructor(color, position) {
        super(color, position);
        this.type = 'bishop';
    }

    GetMoves(map) {
        super.GetMoves();
        let array = [];
        for (let x = this.coords.x + 1, y = this.coords.y + 1; x < 8; x++, y++) {
            if (y >= 0 && y < 8) {
                if (map[y][x] === null)
                    array.push({x: x, y: y});
                else if (map[y][x].GetColor() == this.color) break;
                else array.push({x: x, y: y});
                if (map[y][x] !== null)
                    break;
            }
        }
        for (let x = this.coords.x + 1, y = this.coords.y - 1; x < 8; x++, y--) {
            if (y >= 0 && y < 8) {
                if (map[y][x] === null)
                    array.push({x: x, y: y});
                else if (map[y][x].GetColor() == this.color) break;
                else array.push({x: x, y: y});
                if (map[y][x] !== null)
                    break;
            }
        }
        for (let x = this.coords.x - 1, y = this.coords.y + 1; x >= 0; x--, y++) {
            if (y >= 0 && y < 8) {
                if (map[y][x] === null)
                    array.push({x: x, y: y});
                else if (map[y][x].GetColor() == this.color) break;
                else array.push({x: x, y: y});
                if (map[y][x] !== null)
                    break;
            }
        }
        for (let x = this.coords.x - 1, y = this.coords.y - 1; x >= 0; x--, y--) {
            if (y >= 0 && y < 8) {
                if (map[y][x] === null)
                    array.push({x: x, y: y});
                else if (map[y][x].GetColor() == this.color) break;
                else array.push({x: x, y: y});
                if (map[y][x] !== null)
                    break;
            }
        }
        return array;
    }
}

class Queen extends Figure {
    constructor(color, position) {
        super(color, position);
        this.type = 'queen';
    }

    GetMoves(map) {
        super.GetMoves();
        let array = [],
            tmp = new Bishop(this.color, this.coords);

        tmp.GetMoves(map).forEach(function (item) {
            array.push(item);
        });

        tmp = new Rock(this.color, this.coords);
        tmp.GetMoves(map).forEach(function (item) {
            array.push(item);
        });

        return array;
    }
}

function deepCloning(startObject) {
    var newObject = {};
    newObject.kings = {};
    for (var firstKey in startObject) {
        var innerObject = {};
        var objectProperty = startObject[firstKey];
        if (typeof(objectProperty) == "object") {
            for (var secondKey in objectProperty) {
                if (objectProperty[secondKey] !== null) {
                    let obj = {};
                    switch (objectProperty[secondKey].GetType()) {
                        case 'pawn' :
                            obj = new Pawn(objectProperty[secondKey].GetColor(), objectProperty[secondKey].GetCoords());
                            obj.moved = objectProperty[secondKey].moved;
                            break;
                        case 'knight':
                            obj = new Knight(objectProperty[secondKey].GetColor(), objectProperty[secondKey].GetCoords());
                            break;
                        case 'rock':
                            obj = new Rock(objectProperty[secondKey].GetColor(), objectProperty[secondKey].GetCoords());
                            break;
                        case 'bishop':
                            obj = new Bishop(objectProperty[secondKey].GetColor(), objectProperty[secondKey].GetCoords());
                            break;
                        case 'queen':
                            obj = new Queen(objectProperty[secondKey].GetColor(), objectProperty[secondKey].GetCoords());
                            break;
                        case 'king':
                            obj = new King(objectProperty[secondKey].GetColor(), objectProperty[secondKey].GetCoords());
                            obj.moved = objectProperty[secondKey].moved;
                            newObject.kings[objectProperty[secondKey].GetColor()] = obj;
                            break;

                    }
                    innerObject[secondKey] = obj;
                }
                else innerObject[secondKey] = null;
            }
        }
        else {
            innerObject = null;
        }
        newObject[firstKey] = innerObject;
    }
    return newObject;
}

class King extends Figure {
    constructor(color, position) {
        super(color, position);
        this.type = 'king';
        this.moved = false;
    }

    Check(check = undefined) {
        if (typeof check == "boolean") {
            if (check) this.check = true;
            else this.check = false;
        } else
            return this.check;
    }

    GetMoves(map) {
        super.GetMoves();
        let array = [];

        if (this.coords.x + 1 < 8) {
            if (map[this.coords.y][this.coords.x + 1] === null)
                array.push({x: this.coords.x + 1, y: this.coords.y});
            else if (map[this.coords.y][this.coords.x + 1].GetColor() != this.color)
                array.push({x: this.coords.x + 1, y: this.coords.y});
        }

        if (this.coords.x - 1 >= 0) {
            if (map[this.coords.y][this.coords.x - 1] === null)
                array.push({x: this.coords.x - 1, y: this.coords.y});
            else if (map[this.coords.y][this.coords.x - 1].GetColor() != this.color)
                array.push({x: this.coords.x - 1, y: this.coords.y});
        }

        if (this.coords.y + 1 < 8) {
            if (map[this.coords.y + 1][this.coords.x] === null)
                array.push({x: this.coords.x, y: this.coords.y + 1});
            else if (map[this.coords.y + 1][this.coords.x].GetColor() != this.color)
                array.push({x: this.coords.x, y: this.coords.y + 1});
        }

        if (this.coords.y - 1 >= 0) {
            if (map[this.coords.y - 1][this.coords.x] === null)
                array.push({x: this.coords.x, y: this.coords.y - 1});
            else if (map[this.coords.y - 1][this.coords.x].GetColor() != this.color)
                array.push({x: this.coords.x, y: this.coords.y - 1});
        }

        if (this.coords.x + 1 < 8 && this.coords.y + 1 < 8) {
            if (map[this.coords.y + 1][this.coords.x + 1] === null)
                array.push({x: this.coords.x + 1, y: this.coords.y + 1});
            else if (map[this.coords.y + 1][this.coords.x + 1].GetColor() != this.color)
                array.push({x: this.coords.x + 1, y: this.coords.y + 1});
        }

        if (this.coords.x + 1 < 8 && this.coords.y - 1 >= 0) {
            if (map[this.coords.y - 1][this.coords.x + 1] === null)
                array.push({x: this.coords.x + 1, y: this.coords.y - 1});
            else if (map[this.coords.y - 1][this.coords.x + 1].GetColor() != this.color)
                array.push({x: this.coords.x + 1, y: this.coords.y - 1});
        }

        if (this.coords.x - 1 >= 0 && this.coords.y + 1 < 8) {
            if (map[this.coords.y + 1][this.coords.x - 1] === null)
                array.push({x: this.coords.x - 1, y: this.coords.y + 1});
            else if (map[this.coords.y + 1][this.coords.x - 1].GetColor() != this.color)
                array.push({x: this.coords.x - 1, y: this.coords.y + 1});
        }

        if (this.coords.x - 1 < 8 && this.coords.y - 1 >= 0) {
            if (map[this.coords.y - 1][this.coords.x - 1] === null)
                array.push({x: this.coords.x - 1, y: this.coords.y - 1});
            else if (map[this.coords.y - 1][this.coords.x - 1].GetColor() != this.color)
                array.push({x: this.coords.x - 1, y: this.coords.y - 1});
        }
        return array;
    }
}

class Game {

    constructor() {
        this.map = this.Map();
        this.kings = {white: this.map[0][4], black: this.map[7][4]};
        this.turn = 'white';
    }

    Map() {
        let map = [];
        for (let i = 0; i < 8; i++) {
            map.push([]);
            for (let j = 0; j < 8; j++) {
                map[i][j] = null;
            }
        }
        for (let i = 0; i < 8; i++) {
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
        return map;
    }

    Morph(from, to) {
        from = from.GetCoords();
        let map = this.map;
        switch (to) {
            case 'knight':
                map[from.y][from.x] = new Knight(map[from.y][from.x].GetColor(), {x: from.x, y: from.y});
                break;
            case 'rock':
                map[from.y][from.x] = new Rock(map[from.y][from.x].GetColor(), {x: from.x, y: from.y});
                break;
            case 'bishop':
                map[from.y][from.x] = new Bishop(map[from.y][from.x].GetColor(), {x: from.x, y: from.y});
                break;
            case 'queen':
                map[from.y][from.x] = new Queen(map[from.y][from.x].GetColor(), {x: from.x, y: from.y});
                break;
        }
    }


    GetMoves(from, lastMove, callback) {

        let moves = this.map[from.y][from.x].GetMoves(this.map, lastMove);

        let newMoves = [];
        for (let i = 0; i < moves.length; i++) {
            let newMap = deepCloning(this.map);
            newMap[from.y][from.x].Move(moves[i], newMap, lastMove);
            let newKing = newMap.kings[this.turn].GetCoords();
            let markedCells = this.GetAllPlayerMoves(this.turn == 'white' ? 'black' : 'white', newMap);
            if (!markedCells[newKing.y][newKing.x]) {
                newMoves.push(moves[i]);
            }
        }
        callback(newMoves);
    }


    Move(from, to, lastMove, callback) {

        let newMap = deepCloning(this.map);
        newMap[from.y][from.x].Move(to, newMap, lastMove);

        let newKing = newMap.kings[this.turn].GetCoords();

        let markedCells = this.GetAllPlayerMoves(this.turn == 'white' ? 'black' : 'white', newMap, lastMove);
        if (!markedCells[newKing.y][newKing.x]) {
            if (this.map[from.y][from.x].Move(to, this.map, lastMove))
                callback(true);
        } else callback(false);
    }


    GetAllPlayerMoves(color, map, lastMove = undefined) {
        let markedCells = [];

        for (let i = 0; i < 8; i++) {
            markedCells.push([]);
            for (let j = 0; j < 8; j++) {
                markedCells[i][j] = false;
            }
        }
        markedCells.hasMove = 0;

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (map[i][j] !== null && map[i][j].GetColor() == color) {
                    let moves = map[i][j].GetMoves(map, lastMove);
                    for (let z = 0; z < moves.length; z++) {
                        markedCells[moves[z].y][moves[z].x] = true;
                        markedCells.hasMove++;
                    }
                }
            }
        }

        return (markedCells);
    }

    GetAllPlayerMovesCount(color, lastMove = undefined, callback = undefined) {
        let map = this.map;
        let count = 0, figures = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (map[i][j] !== null && map[i][j].GetColor() == color) {
                    figures.push(map[i][j]);
                }
            }
        }
        let figuresCount = 0;
        let tmp = this
        figures.forEach(function (item) {
            tmp.GetMoves(item.GetCoords(), lastMove, function (res) {
                figuresCount++;
                if (res.length) count += res.length;
                if (figuresCount == figures.length) {
                    callback(count);
                }
            });
        })

    }

    GetMovesColor(lastMove, callback) {
        let king = this.kings[this.turn], kingCoords = king.GetCoords(), res = '';
        let markedCells = this.GetAllPlayerMoves(this.turn == 'white' ? 'black' : 'white', this.map);
        if (markedCells[kingCoords.y][kingCoords.x]) {
            king.Check(true);
            res = 'check';
            this.GetAllPlayerMovesCount(this.turn, lastMove, function (moves) {
                if (!moves)res = 'mate';
                callback(res);
            });

        } else {
            this.GetAllPlayerMovesCount(this.turn, lastMove, function (moves) {
                if (moves) {
                    king.Check(false);
                    res = 'go next';
                }
                else res = 'pate';
                callback(res);
            });


        }


    }
}

module.exports = {
    Pawn: Pawn,
    Rock: Rock,
    Bishop: Bishop,
    Queen: Queen,
    King: King,
    Knight: Knight,
    Game: Game
};