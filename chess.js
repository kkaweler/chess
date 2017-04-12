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

    Move(coords, map) {
        let posibleCoords = this.GetMoves(map);
        for (let i = 0; i < posibleCoords.length; i++)
            if (posibleCoords[i].x == coords.x && posibleCoords[i].y == coords.y) {
                let oldCoords = this.coords;
                this.coords = coords;
                map[this.coords.y][this.coords.x] = this;
                map[oldCoords.y][oldCoords.x] = null;
                if (this.type == 'pawn')
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

    GetMoves(map) {
        super.GetMoves();
        let array = [], direction = this.color == 'white' ? 1 : -1;
        let y = this.coords.y + direction, x = this.coords.x;

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
            tmp = new Bishop('white', this.coords);

        tmp.GetMoves(map).forEach(function (item) {
            array.push(item);
        });

        tmp = new Rock('white', this.coords);
        tmp.GetMoves(map).forEach(function (item) {
            array.push(item);
        });

        return array;
    }
}

class King extends Figure {
    constructor(color, position) {
        super(color, position);
        this.type = 'king';
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

    Morph(from, to, map) {
        from = from.GetCoords();
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