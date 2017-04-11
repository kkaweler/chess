var map = [];
function Game() {
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

    this.drawField = function () {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (map[i][j] !== null) {
                    let element = document.getElementById('field-cell-' + i + j);
                    element.className = "";
                    element.classList.add(map[i][j].type);
                    element.classList.add('not-empty-sell');
                    element.classList.add(map[i][j].color);
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
                            map[parent.y][parent.x].Move({x: parseInt(this.dataset.x), y: parseInt(this.dataset.y)});
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
    game.drawField();

}
