const keyButtons = document.querySelectorAll('.main-keyboard-inner-button');
const hangman = document.querySelector('.main-hangman');
const wordContainer = document.querySelector('.main-word');
const categoryText = document.querySelector('#categoryText');
const popupMenu = document.querySelector('.main-menu');
const popupMenuText = document.querySelector('#popupMenuText');
const playAgainButton = document.querySelector('#playAgainButton');
const menuOpenButton = document.querySelector('#menuOpenButton');
const menu = document.querySelector('.menu');
const main = document.querySelector('main');
const startButton = document.querySelector('#startButton');
const mainMenuButton = document.querySelector('#mainMenuButton');

// GAME OBJECT
const gameObj = {
    word: {
        wordCategory: undefined,
        wordItself: undefined,
    },
    categories: ['Fruits', 'Animals', 'Colors', 'Countries', 'Jobs'],
    hangman: {
        hangmanCounter: 0,
        hangmanImage: ['./assets/1.png', './assets/2.png', './assets/3.png', './assets/4.png', './assets/5.png', './assets/6.png', './assets/7.png'],
        hangmanAnimation: ['500ms steps(8, jump-none) infinite hangman-step-animation', '500ms steps(4, jump-none) infinite hangman-step-animation', '500ms steps(3, jump-none) infinite hangman-step-animation', '500ms steps(2, jump-none) infinite hangman-step-animation', '500ms steps(2, jump-none) infinite hangman-step-animation', '500ms steps(1, jump-none) infinite hangman-step-animation', '500ms steps(1, jump-none) infinite hangman-step-animation'],
    },
    letterFound: false,
    gameHasBeenWon: false,
    isGameStarted: false,
};

// HIDE THE MENU

function hideTheMenu() {
    menu.classList.add('menu-hidden');
    main.classList.add('main-active');

    // STARTING THE GAME
    gettingARandomWord();
};

// GO BACK TO MAIN MENU

function goBackToMainMenu() {
    menu.classList.remove('menu-hidden');
    main.classList.remove('main-active');
    // RESETTING EVERYTHING
    resettingEverything();
    // CLOSING THE POP MENU
    closeMenu();
};

// OPEN MENU

function openMenu() {
    handlingThePlayAgainButtonText();
    popupMenu.classList.add('main-menu-active');
};

// CLOSE MENU

function closeMenu() {
    popupMenu.classList.remove('main-menu-active');
};

// HANDLING THE PLAY AGAIN BUTTON

function handlingThePlayAgainButtonText() {
    if (gameObj.isGameStarted === false) {
        playAgainButton.textContent = 'PLAY AGAIN';
    } else {
        playAgainButton.textContent = 'CONTINUE';
        popupMenuText.textContent = 'Never give up!';
    };
};

// GETTING A RANDOM WORD

async function gettingARandomWord() {
    try {
        const response = await fetch('./data.json');
        
        if (!response.ok) {
            throw new Error(response.status);
        };

        const data = await response.json();

        gameObj.word.wordCategory = gameObj.categories[Math.floor(Math.random() * gameObj.categories.length)];
        gameObj.word.wordItself = data.categories[gameObj.word.wordCategory][Math.floor(Math.random() * data.categories[gameObj.word.wordCategory].length)].toLowerCase();

        categoryText.textContent = gameObj.word.wordCategory;
        displayingTheWordElements();
    } catch(e) {
        console.error(e);
        console.error(e.name);
        console.error(e.message);
    };
};

// DISPLAYING THE WORD ELEMENTS

function displayingTheWordElements() {
    wordContainer.innerHTML = '';
    for (let i = 0; i < gameObj.word.wordItself.length; i++) {
        const wordItself = document.createElement('span');
        wordItself.classList.add('main-word-inner');
        wordItself.textContent = '_';

        wordContainer.appendChild(wordItself);
    };

    enablingTheKeyButtons();
    gameObj.isGameStarted = true;
};

// ENABLING THE KEY BUTTONS

function enablingTheKeyButtons() {
    for (const keyButton of keyButtons) {
        keyButton.disabled = false;
    };
};

// DISABLING THE KEY BUTTONS

function disablingTheKeyButtons() {
    for (const keyButton of keyButtons) {
        keyButton.disabled = true;
    };
};

// ENTERING VALUES

for (let i = 0; i < keyButtons.length; i++) {
    keyButtons[i].addEventListener('click', () => {
        const keyValue = keyButtons[i].value;
        
        checkIfTheKeyExists(keyValue);

        // HANDLING THE HANGMAN AND TEXT
        for (let inner = 0; inner < gameObj.word.wordItself.length; inner++) {
            if (keyValue === gameObj.word.wordItself[inner]) {
                wordContainer.children[inner].textContent = gameObj.word.wordItself[inner];
            } else {
                // CHANGING THE ANIMATION
                hangman.style.background = `url(${gameObj.hangman.hangmanImage[gameObj.hangman.hangmanCounter]}) no-repeat`;
                hangman.style.backgroundSize = 'cover';
                hangman.style.backgroundPosition = 'left';
                hangman.style.animation = gameObj.hangman.hangmanAnimation[gameObj.hangman.hangmanCounter];
            };
        };

        if (gameObj.letterFound === false) {
            keyButtons[i].disabled = true;
            keyButtons[i].classList.add('main-keyboard-inner-button-non-existent');
            keyButtons[i].classList.remove('main-keyboard-inner-button-found');
            gameObj.hangman.hangmanCounter++;
        } else {
            keyButtons[i].disabled = true;
            keyButtons[i].classList.add('main-keyboard-inner-button-found');
            keyButtons[i].classList.remove('main-keyboard-inner-button-non-existent');
        };

        // CHECK IF THE GAME HAS BEEN WON
        checkIfTheGameHasBeenWon();

        if (gameObj.gameHasBeenWon === false) {
            // CHECK IF THE PLAYER HAD USED ALL ITS ATTEMPTS
            if (gameObj.hangman.hangmanCounter === gameObj.hangman.hangmanImage.length) {
                disablingTheKeyButtons();
                revealTheWord();
                popupMenuText.textContent = 'Opps, You died. Try again';
                setTimeout(() => popupMenu.classList.add('main-menu-active'), 2000);
                gameObj.isGameStarted = false;
                handlingThePlayAgainButtonText();
            };
        };
    });
};

// CHECK IF THE KEY EXISTS

function checkIfTheKeyExists(keyValue) {
    for (let i = 0; i < gameObj.word.wordItself.length; i++) {
        if (gameObj.word.wordItself[i] === keyValue) {
            gameObj.letterFound = true;
            return;
        } else {
            gameObj.letterFound = false;
        };
    };
};

// REVEAL THE WORD

function revealTheWord() {
    for (let i = 0; i < gameObj.word.wordItself.length; i++) {
        wordContainer.children[i].textContent = gameObj.word.wordItself[i];
    };
};

// CHECK IF THE GAME HAS BEEN WON

function checkIfTheGameHasBeenWon() {
    let counter = 0;

    for (let i = 0; i < gameObj.word.wordItself.length; i++) {
        if (gameObj.word.wordItself[i] === wordContainer.children[i].textContent) {
            counter++;

            if (counter === gameObj.word.wordItself.length) {
                popupMenuText.innerHTML = 'Congratulations, </br>You found the word!';
                setTimeout(() => popupMenu.classList.add('main-menu-active'), 2000);
                gameObj.gameHasBeenWon = true;
                disablingTheKeyButtons();

                // CHANGING THE ANIMATION
                hangman.style.background = `url(./assets/win.png) no-repeat`;
                hangman.style.backgroundSize = 'cover';
                hangman.style.backgroundPosition = 'left';
                hangman.style.animation = '500ms steps(3, jump-none) infinite hangman-step-animation';

                gameObj.isGameStarted = false;
                handlingThePlayAgainButtonText();
            };
        } else {
            counter = 0;
        };
    };
};

// RESETTING EVERYTHING

function resettingEverything() {
    gameObj.word.wordItself = undefined;
    gameObj.word.wordCategory = undefined;
    gameObj.hangman.hangmanCounter = 0;
    gameObj.letterFound = false;
    gameObj.isGameStarted = false;
    gameObj.gameHasBeenWon = false;

    // CHANGING THE ANIMATION
    hangman.style.background = `url(./assets/0.png) no-repeat`;
    hangman.style.backgroundSize = 'cover';
    hangman.style.backgroundPosition = 'left';
    hangman.style.animation = '500ms steps(4, jump-none) infinite hangman-step-animation';

    
    // REMOVING THE ADDITTIONAL CLASSES FROM THE KEY BUTTONS
    for (const keyButton of keyButtons) {
        keyButton.setAttribute('class', 'main-keyboard-inner-button');
    };
};

// PLAY AGAIN

function playAgain() {
    // RESETTING EVERYTHING
    resettingEverything();

    // STARTING THE GAME AGAIN
    gettingARandomWord();

    // CLOSING THE POP MENU
    closeMenu();
};

// INITIALIZING THE BUTTONS
mainMenuButton.addEventListener('click', goBackToMainMenu);
startButton.addEventListener('click', hideTheMenu);
menuOpenButton.addEventListener('click', openMenu);
playAgainButton.addEventListener('click', () => {
    if (gameObj.isGameStarted === true) {
        closeMenu();
    } else {
        playAgain();
    };
});