// Get the modal
const modal = document.getElementById('myModal');
const winMessage = document.getElementById("winMessage");

// When the user clicks the reset button, start the game again
const restartBtns = document.querySelectorAll(".restart");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];/*

 * Create a list that holds all of your cards
 */
const cards = ['fa-diamond', 'fa-diamond',
    'fa-paper-plane-o', 'fa-paper-plane-o',
    'fa-anchor', 'fa-anchor',
    'fa-bolt', 'fa-bolt',
    'fa-cube', 'fa-cube',
    ' fa-leaf', ' fa-leaf',
    'fa-bicycle', 'fa-bicycle',
    'fa-bomb', 'fa-bomb'
];

const deck = document.querySelector('.deck');

let movesCounter = 0, time = 0, timer, starsCounter = 3;

const stars = document.querySelectorAll(".fa-star");
const timerElement = document.querySelector(".timer");
const movesElement = document.querySelector(".moves");

let allCards; // all cards will be stored here
let cardsMatched = 0, cardsCurrent = [];


startGame();

function createCard(card) {
    return `<li class="card""><i class="fa ${card}"></i></li>`;
}

function startGame() {
    timer = setInterval(() => { 
        time++;
        timerElement.textContent = getTimeString(time);
    }, 1000)
    
    const cardList = shuffle(cards).map(card => createCard(card));
    deck.innerHTML = cardList.join('');
    allCards = document.querySelectorAll('.card');
    allCards.forEach(card => card.addEventListener('click', handleClick));
}


// displaying the time in a nice format
function getTimeString(time) { 
    let minutes0 = Math.floor(time / 600),
        minutes1 = Math.floor(time / 60) % 10,
        seconds = Math.floor(time % 60),
        seconds0 = Math.floor(seconds / 10),
        seconds1 = seconds % 10;
    return minutes0.toString() + minutes1.toString() + ":" + seconds0.toString() + seconds1.toString();
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


function flipCard() {
    this.classList.toggle('open');
    this.classList.toggle('show');
}


function handleClick() { 
    //ignore click if it's already open
    if (this.classList.contains("open")) {
        console.log("ignoring click because this card is already open");
        return;
    }
    //ignore click if 2 cards already open
    else if (cardsCurrent.length == 2) {
        console.log("ignoring click because 2 cards open");
        return;
    }
    else {
        //call the flipCard function, with the card as its 'this' object
        flipCard.apply(this);   
        cardsCurrent.push(this);
        if (cardsCurrent.length == 1) { 
            afterMove();
        }
        else if (cardsCurrent.length == 2) {
            // compare the 2 open cards
            // if they match, increase cards matched
            if (cardsCurrent[0].firstElementChild.classList.value == cardsCurrent[1].firstElementChild.classList.value) {
                console.log("cards match.");

                //add the card to matched after 500ms
                setTimeout(() => {
                    cardsCurrent.forEach(card => card.classList.add("match"));
                    cardsMatched += 2;
                    cardsCurrent = [];
                    afterMove();
                }, 500)
            }
            else { 
                console.log("should close the cards. they don't match");
                // close cards after a time of 1000ms
                setTimeout(() => {
                    cardsCurrent.forEach(card => flipCard.apply(card));
                    cardsCurrent = [];
                    afterMove();
                }, 1000)
                
            }
        }
        else { 
            console.log("something went wrong");
        }
    }
}

// function that decides what happens after the move
function afterMove() { 
    // increase move counter and update display
    movesCounter++;
    movesElement.textContent = movesCounter;

    // reduce stars count 
    if (movesCounter == 24) {
        console.log("reducing star");
        stars[0].style.color = "#cecece";
        starsCounter--;
    }
    else if (movesCounter == 40) { 
        console.log("reducing star");
        stars[1].style.color = "#cecece";
        starsCounter--;
    }

    // check if all 16 cards were matched
    if (cardsMatched == 16) { 
        console.log("game won");
        win();
    }
}

function win() { 
    clearInterval(timer);
    const message = `You needed ${getTimeString(time)} time, and ${movesCounter} moves to finish the game. You got ${starsCounter} stars.`
    winMessage.textContent = message;
    modal.style.display = "block";
}

function restart() { 
    console.log("in restart function");
    clearInterval(timer);
    stars.forEach(star => star.style.color = "black");
    starsCounter = 3;
    movesCounter = 0;
    movesElement.textContent = movesCounter;
    time = 0;
    timerElement.textContent = getTimeString(time);
    cardsMatched = 0;
    cardsCurrent = [];
    modal.style.display = "none";
    startGame();
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

restartBtns.forEach(button => button.addEventListener("click", restart));