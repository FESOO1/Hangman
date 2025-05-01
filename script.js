const keyButtons = document.querySelectorAll('.main-keyboard-inner-button');
const hangman = document.querySelector('.main-hangman');
const wordContainer = document.querySelector('.main-word');
const categoryText = document.querySelector('#categoryText');

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

gettingARandomWord();

// DISPLAYING THE WORD ELEMENTS

function displayingTheWordElements() {
    for (let i = 0; i < gameObj.word.wordItself.length; i++) {
        const wordItself = document.createElement('span');
        wordItself.classList.add('main-word-inner');
        wordItself.textContent = '_';

        wordContainer.appendChild(wordItself);
    };

    enablingTheKeyButtons();
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
        let found = false;

        for (let inner = 0; inner < gameObj.word.wordItself.length; inner++) {
            if (keyValue === gameObj.word.wordItself[inner]) {
                wordContainer.children[inner].textContent = gameObj.word.wordItself[inner];
                found = true;
                return;
            } else {
                // CHANGING THE ANIMATION
                hangman.style.background = `url(${gameObj.hangman.hangmanImage[gameObj.hangman.hangmanCounter]}) no-repeat`;
                hangman.style.backgroundSize = 'cover';
                hangman.style.backgroundPosition = 'left';
                hangman.style.animation = gameObj.hangman.hangmanAnimation[gameObj.hangman.hangmanCounter];
                found = false;
            };
        };

        if (found === false) {
            keyButtons[i].disabled = true;
            keyButtons[i].classList.add('main-keyboard-inner-button-non-existent');
            keyButtons[i].classList.remove('main-keyboard-inner-button-found');
            gameObj.hangman.hangmanCounter++;
        } else {
            keyButtons[i].disabled = true;
            keyButtons[i].classList.add('main-keyboard-inner-button-found');
            keyButtons[i].classList.remove('main-keyboard-inner-button-non-existent');
        };

        // CHECK IF THE PLAYER HAD USED ALL ITS ATTEMPTS
        if (gameObj.hangman.hangmanCounter === gameObj.hangman.hangmanImage.length) {
            console.log('Opps, you died.');
            disablingTheKeyButtons();
            revealTheWord();
        };
    });
};

// REVEAL THE WORD

function revealTheWord() {
    for (let i = 0; i < gameObj.word.wordItself.length; i++) {
        wordContainer.children[i].textContent = gameObj.word.wordItself[i];
    };
};