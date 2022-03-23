import { words } from './words.js'

// Selecting HTML items
const wordDisplay = document.querySelector('#wordDisplay')
const tipDisplay = document.querySelector('#tipDisplay')
const lettersDisplay = document.querySelector('#lettersDisplay')
const numberOfLettersDisplay = document.querySelector('#numberOfLettersDisplay')
const chancesDisplay = document.querySelector('#chancesDisplay')
const chance2 = document.querySelector('#chance2')
const chance1 = document.querySelector('#chance1')
const chance0 = document.querySelector('#chance0')
const form = document.querySelector('form')
const inputLetter = document.querySelector('input')

const correct = new Audio('./assets/audio/correct.mp3')
const wrong = new Audio('./assets/audio/wrong.mp3')
const lose = new Audio('./assets/audio/lose.mp3')
const win = new Audio('./assets/audio/win.mp3')

const numberOfChances = 3
const hangedColor = 'color: #FF4040'
const timeoutToShowAlert = 500

// GET
const getHangman = () => JSON.parse(localStorage.getItem('hangman'))

// SET
const setHangman = hangman => localStorage.setItem('hangman', JSON.stringify(hangman))

// Selecting random word
const randomNumberOfWord = () => Math.floor(Math.random() * words.length - 1)

// Selecting word
const selectWord = () => words[randomNumberOfWord()]

// Verifing if the letter has already been informed
const letterHasAlreadyBeenInformed = letter => {
    const { letters } = getHangman()

    if (letters.length > 0) {
        for (let i of letters)
            if (i === letter) return true
    }
    return false
}

// Verifing if the letter exist
const letterExist = letter => {
    const hangman = getHangman()

    for (let i of hangman.wordSplitted) {
        if (i === letter) return correct.play()
    }

    if (hangman.chances === 3) {
        wrong.play()
        chance2.style = hangedColor
        hangman.chances = 2
    } else if (hangman.chances === 2) {
        wrong.play()
        chance1.style = hangedColor
        hangman.chances = 1
    } else if (hangman.chances === 1) {
        chance0.style = hangedColor
        hangman.chances = 0

        lose.play()
        setTimeout(() => showAlert('lostAllChances', hangman.word), timeoutToShowAlert)
    }
    chancesDisplay.innerHTML = hangman.chances
    setHangman(hangman)
}

// Update all displays
const updateDisplays = (hangman) => {
    wordDisplay.innerHTML = hangman.awnser.join(' ')
    tipDisplay.innerHTML = hangman.tip
    numberOfLettersDisplay.innerHTML = hangman.awnser.length
    chancesDisplay.innerHTML = hangman.chances
    lettersDisplay.innerHTML = hangman.letters.length ? hangman.letters : '-'
}

// Updating letters on display
const updateLettersOnDisplay = () => {
    const { letters } = getHangman()

    lettersDisplay.innerHTML = ''
    lettersDisplay.innerHTML = letters.length > 1 ? letters.join(' - ') : letters
}

// Showing alerts
const showAlert = (msg, word) => {
    if (msg === 'wordWrong')
        alert('Você errou! 😞 \nA resposta certa era: ' + word)
    else if (msg === 'lostAllChances')
        alert('Enforcado! Você errou a letra pela 3ª vez. 😞 \nA palavra era: ' + word)
    else
        alert('Parabéns! Você acertou! 🥳')

    location.reload()
}

// Starting
const init = () => {
    const hangman = {}
    const { word, tip } = selectWord()
    const allLettersFromWord = word.split('')
    const bars = new Array(allLettersFromWord.length).fill('_')

    hangman.word = word
    hangman.tip = tip
    hangman.letters = []
    hangman.wordSplitted = allLettersFromWord
    hangman.chances = numberOfChances
    hangman.awnser = bars

    localStorage.removeItem('hangman')
    setHangman(hangman)
    updateDisplays(hangman)
}

init()

// Button
const showLetter = e => {
    e.preventDefault()

    const letterOrWord = inputLetter.value.trim().toLowerCase()
    const { word, wordSplitted } = getHangman()

    if (letterOrWord === '') return alert('ATENÇÃO: Você precisa informar uma letra ou a palavra para continuar.')
    inputLetter.value = ''

    if (letterOrWord.length === 1) {
        if (!letterHasAlreadyBeenInformed(letterOrWord)) {
            letterExist(letterOrWord)
            const hangman = getHangman()

            for (let i = 0; i < wordSplitted.length; i++) {
                if (wordSplitted[i] === letterOrWord)
                    hangman.awnser[i] = letterOrWord
            }
            wordDisplay.innerHTML = hangman.awnser.join(' ')

            hangman.letters.push(letterOrWord)
            setHangman(hangman)
            updateLettersOnDisplay()
        } else
            alert('ATENÇÃO: Essa letra já foi informada!')
    } else {
        if (word === letterOrWord) {
            win.play()
            setTimeout(() => showAlert('win'), timeoutToShowAlert)
        } else {
            lose.play()
            setTimeout(() => showAlert('wordWrong', word), timeoutToShowAlert)
        }
    }
}

form.addEventListener('submit', showLetter)