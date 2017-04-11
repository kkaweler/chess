class Figure {
    constructor(newColor, position) {
        this.color = newColor;
        this.coords = position;
    }

    Move(coords) {
        let posibleCoords = this.GetMoves();
        for (let i = 0; i < posibleCoords.length; i++)
            if (posibleCoords[i].x == coords.x && posibleCoords[i].y == coords.y) {
                let oldCoords = this.coords;
                this.coords = coords;

                let oldObj = document.getElementById('field-cell-' + oldCoords.y + oldCoords.x),
                    newObj = document.getElementById('field-cell-' + coords.y + coords.x);

                newObj.className = "";
                oldObj.classList.forEach(function (item) {
                    newObj.classList.add(item);
                });
                oldObj.className = "";

                if (this.type == 'pawn') {
                    this.moved = true;
                    if ((this.color == 'white' && this.coords.y == 7) || (this.color == 'black' && this.coords.y == 0)) {
                        let morphDiv = document.createElement('div');
                        morphDiv.style.width = '50px';
                        morphDiv.classList.add('morph')
                        morphDiv.style.position = "absolute";
                        morphDiv.style.left = (mainDiv.offsetLeft + mainDiv.offsetWidth + 25) + 'px';
                        morphDiv.style.top = '7px';
                        let tmp = ['queen', 'rock', 'bishop', 'knight'];
                        let color = this.color;
                        tmp.forEach(function (item) {
                            let el = document.createElement('div');
                            el.classList.add(item);
                            el.classList.add('not-empty-sell');
                            el.classList.add(color);
                            el.dataset.morph = item;
                            el.dataset.x = coords.x;
                            el.dataset.y = coords.y;
                            morphDiv.appendChild(el);
                        });
                        document.body.appendChild(morphDiv);
                    }
                }

                map[this.coords.y][this.coords.x] = this;
                map[oldCoords.y][oldCoords.x] = null;
                DeleteHighlighted();
                return true;
            }
        return false;
    }

    GetMoves() {
        this.coords.x = parseInt(this.coords.x);
        this.coords.y = parseInt(this.coords.y);
    }

}

class Pawn extends Figure {
    constructor(color, position) {
        super(color, position);
        this.type = 'pawn';
        this.moved = false;
    }

    SetMoved() {
        this.moved = true;
    }

    GetMoves() {
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

class Knight extends Figure {

    constructor(color, position) {
        super(color, position);
        this.type = 'knight';
    }

    GetMoves() {
        super.GetMoves();
        let array = [];
        let y = this.coords.y, x = this.coords.x;

        //------------------
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
        //--------------------------

        if (y - 1 >= 0 && x + 2 < 8)
            if (map[y - 1][x + 2] === null)
                array.push({x: x + 2, y: y - 1});
            else if (map[y - 1][x + 2].color != this.color)
                array.push({x: x + 2, y: y - 1});

        if (y - 1 >= 0 && x - 2 >= 0)
            if (map[y - 1][x - 2] === null)
                array.push({x: x - 2, y: y - 1});
            else if (map[y - 1][x - 2].color != this.color)
                array.push({x: x - 2, y: y - 1});

        if (y + 1 < 8 && x + 2 < 8)
            if (map[y + 1][x + 2] === null)
                array.push({x: x + 2, y: y + 1});
            else if (map[y + 1][x + 2].color != this.color)
                array.push({x: x + 2, y: y + 1});

        if (y + 1 < 8 && x - 2 >= 0)
            if (map[y + 1][x - 2] === null)
                array.push({x: x - 2, y: y + 1});
            else if (map[y + 1][x - 2].color != this.color)
                array.push({x: x - 2, y: y + 1});

        return array;
    }
}

class Rock extends Figure {
    constructor(color, position) {
        super(color, position);
        this.type = 'rock';
    }

    GetMoves() {
        super.GetMoves();
        let array = [];

        for (let x = this.coords.x + 1; x < 8; x++) {
            let toInsert = {x: x, y: this.coords.y};
            if (map[toInsert.y][toInsert.x] === null)
                array.push(toInsert);
            else if (map[toInsert.y][toInsert.x].color == this.color) break;
            else array.push(toInsert);
            if (map[toInsert.y][toInsert.x] !== null)
                break;
        }

        for (let x = this.coords.x - 1; x >= 0; x--) {
            let toInsert = {x: x, y: this.coords.y};
            if (map[toInsert.y][toInsert.x] === null)
                array.push(toInsert);
            else if (map[toInsert.y][toInsert.x].color == this.color) break;
            else array.push(toInsert);
            if (map[toInsert.y][toInsert.x] !== null)
                break;
        }

        for (let y = this.coords.y + 1; y < 8; y++) {
            let toInsert = {x: this.coords.x, y: y};
            if (map[toInsert.y][toInsert.x] === null)
                array.push(toInsert);
            else if (map[toInsert.y][toInsert.x].color == this.color) break;
            else array.push(toInsert);
            if (map[toInsert.y][toInsert.x] !== null)
                break;
        }

        for (let y = this.coords.y - 1; y >= 0; y--) {
            let toInsert = {x: this.coords.x, y: y};
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

class Bishop extends Figure {
    constructor(color, position) {
        super(color, position);
        this.type = 'bishop';
    }

    GetMoves() {
        super.GetMoves();
        let array = [];
        for (let x = this.coords.x + 1, y = this.coords.y + 1; x < 8; x++, y++) {
            if (y >= 0 && y < 8) {
                if (map[y][x] === null)
                    array.push({x: x, y: y});
                else if (map[y][x].color == this.color) break;
                else array.push({x: x, y: y});
                if (map[y][x] !== null)
                    break;
            }
        }
        for (let x = this.coords.x + 1, y = this.coords.y - 1; x < 8; x++, y--) {
            if (y >= 0 && y < 8) {
                if (map[y][x] === null)
                    array.push({x: x, y: y});
                else if (map[y][x].color == this.color) break;
                else array.push({x: x, y: y});
                if (map[y][x] !== null)
                    break;
            }
        }
        for (let x = this.coords.x - 1, y = this.coords.y + 1; x >= 0; x--, y++) {
            if (y >= 0 && y < 8) {
                if (map[y][x] === null)
                    array.push({x: x, y: y});
                else if (map[y][x].color == this.color) break;
                else array.push({x: x, y: y});
                if (map[y][x] !== null)
                    break;
            }
        }
        for (let x = this.coords.x - 1, y = this.coords.y - 1; x >= 0; x--, y--) {
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

class Queen extends Figure {
    constructor(color, position) {
        super(color, position);
        this.type = 'queen';
    }

    GetMoves() {
        super.GetMoves();
        let array = [],
            tmp = new Bishop('white', this.coords);

        tmp.GetMoves().forEach(function (item) {
            array.push(item);
        });

        tmp = new Rock('white', this.coords);
        tmp.GetMoves().forEach(function (item) {
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

    GetMoves() {
        super.GetMoves();
        let array = [];

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