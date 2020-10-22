const GRID = document.querySelector('.grid');
const SCORE = document.querySelector('#score');
const BTN = document.querySelector('#start-button');
const WIDTH = 10;
const BTN2 = document.querySelector('#play-button');
const COLOR = ['#FF0000', '#FF9700', '#FFFF00', '#6CFF00', '#00C5FF', '#FF00AE'];

// arr brick
const BRICK_L = [
    [1, WIDTH + 1, WIDTH * 2 + 1, 2],
    [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 2],
    [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 2],
    [WIDTH, WIDTH * 2, WIDTH * 2 + 1, WIDTH * 2 + 2]
];
const BRICK_Z = [
    [0, WIDTH, WIDTH + 1, WIDTH * 2 + 1],
    [WIDTH + 1, WIDTH + 2, WIDTH * 2, WIDTH * 2 + 1],
    [0, WIDTH, WIDTH + 1, WIDTH * 2 + 1],
    [WIDTH + 1, WIDTH + 2, WIDTH * 2, WIDTH * 2 + 1]
];

const BRICK_T = [
    [1, WIDTH, WIDTH + 1, WIDTH + 2],
    [1, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 1],
    [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 1],
    [1, WIDTH, WIDTH + 1, WIDTH * 2 + 1]
];

const BRICK_O = [
    [0, 1, WIDTH, WIDTH + 1],
    [0, 1, WIDTH, WIDTH + 1],
    [0, 1, WIDTH, WIDTH + 1],
    [0, 1, WIDTH, WIDTH + 1]
];
const BRICK_I = [
    [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 3 + 1],
    [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH + 3],
    [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 3 + 1],
    [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH + 3]
];
const THE_BRICK = [BRICK_L, BRICK_Z, BRICK_T, BRICK_O, BRICK_I];

//
let currentPosition = 4;
let currentRotation = 0;

//  random arr brick
let random = Math.floor(Math.random() * THE_BRICK.length);
let current = THE_BRICK[random][currentRotation];

// random color brick
let randomColor = Math.floor(Math.random() * COLOR.length);
let color = COLOR[randomColor];
console.log(color);

// get div
let boxs = Array.from(document.querySelectorAll('.grid div'));

// draw


function draw() {
    //
    current.forEach(index => {

        boxs[currentPosition + index].classList.add('theBox');
        boxs[currentPosition + index].style.backgroundColor = color;

    })
}
draw();

// undraw

function undraw() {
    current.forEach(index => {
        boxs[currentPosition + index].classList.remove('theBox');
        boxs[currentPosition + index].style.backgroundColor = '';
    })
}

// setInterval
var time = setInterval(moveDown, 1000);


// event listener
function control(evt) {
    if (evt.keyCode === 37) {
        moveLeft();
    }
    if (evt.keyCode === 38) {
        moveUp();
    }
    if (evt.keyCode === 39) {
        moveRight();
    }
    if (evt.keyCode === 40) {
        moveDown();
    }
}

document.addEventListener('keydown', control);


// function move down

function moveDown() {
    undraw();
    currentPosition += WIDTH;
    draw();
    freeze();
}

// freeze function

function freeze() {
    if (current.some(index => boxs[currentPosition + index + WIDTH].classList.contains('last'))) {
        // draw tiles at the end position
        current.forEach(index => boxs[currentPosition + index].classList.add('last'));

        //
        random = Math.floor(Math.random() * THE_BRICK.length);
        current = THE_BRICK[random][currentRotation];
        currentPosition = 4;
        randomColor = Math.floor(Math.random() * COLOR.length);
        color = COLOR[randomColor];
        draw();
    }
    addScore();
    speed();
    gameOver();
}

// move left
function moveLeft() {
    undraw();
    // check brick on the first col
    let isLeft = current.some(index => (currentPosition + index) % WIDTH === 0);

    if (!isLeft) currentPosition -= 1;
    // check brick on the left
    if (current.some(index => boxs[currentPosition + index].classList.contains('last'))) {
        currentPosition += 1;
    }
    draw();

}
// move right
function moveRight() {
    undraw();
    // check brick on the last col
    let isRight = current.some(index => (currentPosition + index) % WIDTH === WIDTH - 1);
    if (!isRight) currentPosition += 1;
    // check brick on the left
    if (current.some(index => boxs[currentPosition + index].classList.contains('last'))) {
        currentPosition -= 1;
    }
    draw();

}

function moveUp() {
    undraw();
    currentRotation++;
    if (currentRotation === 4) {
        currentRotation = 0;
    }
    current = THE_BRICK[random][currentRotation];
    draw();
}

// start or pause game
BTN.addEventListener('click', () => {
    if (time) {
        clearInterval(time);
        time = null;
    } else {
        time = setInterval(moveDown, 1000);
    }
})

//reload game

BTN2.addEventListener('click', () => {
    location.reload();
})

// add score 
var score = 0;
// add score and remove row
function addScore() {
    for (let i = 0; i < 199; i += WIDTH) {
        const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

        if (row.every(index => boxs[index].classList.contains('last'))) {
            score += 10;
            SCORE.innerHTML = score;

            row.forEach(index => {
                boxs[index].classList.remove('last');
                boxs[index].classList.remove('theBox');
                boxs[index].style.backgroundColor = '';
            });
            const squaresRemoved = boxs.splice(i, 10)
            boxs = squaresRemoved.concat(boxs)
            boxs.forEach(cell => {
                GRID.appendChild(cell)
                cell.style.marginLeft = '1.8px';
                cell.style.marginRight = '1.8px';
            })
        }
    }
}

// game over

function gameOver() {
    if (current.some(index => boxs[currentPosition + index].classList.contains('last'))) {
        SCORE.innerHTML = 'NGU';
        console.log('game over')
        clearInterval(time);
    }
}

// Speed

function speed() {
    if (score >= 100 && score < 200) {
        clearInterval(time);
        time = setInterval(moveDown, 800);
        console.log('800mls')
    } else if (score >= 200 && score < 400) {
        clearInterval(time);
        time = setInterval(moveDown, 600);
        console.log('600mls')
    } else if (score >= 400 && score < 600) {
        clearInterval(time);
        time = setInterval(moveDown, 400);
        console.log('400mls')
    } else if (score >= 600) {
        clearInterval(time);
        time = setInterval(moveDown, 200);
        console.log('200mls')
    }
}