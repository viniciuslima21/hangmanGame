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

const letters = []

const numberOfChances = 3

// Selecting random word
const randomNumberOfWord = () => Math.floor(Math.random() * words.length - 1)

// GETS
const getWord = () => JSON.parse(localStorage.getItem('word'))

const getWordSplitted = () => JSON.parse(localStorage.getItem('wordSplitted'))

const getLetters = () => JSON.parse(localStorage.getItem('letters'))

const getAnswer = () => JSON.parse(localStorage.getItem('awnser'))

const getChances = () => JSON.parse(localStorage.getItem('chances'))

// SETS
const setWord = word => localStorage.setItem('word', JSON.stringify(word))

const setWordSplitted = word => localStorage.setItem('wordSplitted', JSON.stringify(word))

const setLetters = letter => localStorage.setItem('letters', JSON.stringify(letter))

const setAwnser = awnser => localStorage.setItem('awnser', JSON.stringify(awnser))

const setChances = chance => localStorage.setItem('chances', JSON.stringify(chance))

// Selecting word
const selectWord = () => { return words[randomNumberOfWord()] }

// Generating bars, tip and length
const generateAll = (letters, tip, length) => {
    const bars = new Array(letters.length).fill('_')

    setAwnser(bars)
    wordDisplay.innerHTML = bars.join(' ')
    tipDisplay.innerHTML = tip
    numberOfLettersDisplay.innerHTML = length
}

// Verifing if the letter has already been informed
const letterHasAlreadyBeenInformed = letter => {
    const letterHasAlreadyBeenInformed = getLetters()

    if (letterHasAlreadyBeenInformed.length > 0) {
        for (let i of letterHasAlreadyBeenInformed) {
            if (i === letter) return true
        }
    }
    return false
}

// Verifing if the letter exist
const letterExist = letter => {
    const wordSplitted = getWordSplitted()
    const { word } = getWord()
    const style = 'color: #0febdc'
    let chances = getChances()

    for (let i of wordSplitted) {
        if (i === letter) return
    }

    if (chances === 3) {
        chance2.style = style
        chances = 2
    } else if (chances === 2) {
        chance1.style = style
        chances = 1
    }
    else if (chances === 1) {
        chance0.style = style
        chances = 0

        setTimeout(() => {
            alert('Enforcado! Você errou a letra pela 3ª vez. 😞 \nA resposta certa era: ' + word)
            location.reload()
        }, 600)
    }
    setChances(chances)
    chancesDisplay.innerHTML = chances
}

// Updating letters on display
const updateLettersOnDisplay = () => {
    const letters = getLetters()

    lettersDisplay.innerHTML = ''
    lettersDisplay.innerHTML = letters.length > 1 ? letters.join(' - ') : letters
}

// Cleaning displays
const cleanDisplays = () => {
    wordDisplay.innerHTML = ''
    tipDisplay.innerHTML = ''
    lettersDisplay.innerHTML = '-'
}

// Starting
const init = () => {
    const selectedWord = selectWord()
    const { word, tip } = selectedWord
    const allLettersFromWord = word.split('')

    cleanDisplays()
    setLetters([])
    setWord(selectedWord)
    setWordSplitted(allLettersFromWord)
    setChances(numberOfChances)
    generateAll(allLettersFromWord, tip, word.length)
}

init()

// Button
const showLetter = e => {
    e.preventDefault()

    const letterOrWord = inputLetter.value.trim().toLowerCase()
    const { word } = getWord()
    const wordSplitted = getWordSplitted()
    const awnser = getAnswer()

    if (letterOrWord === '') return alert('ATENÇÃO: Você precisa informar uma letra ou a palavra para continuar.')

    inputLetter.value = ''

    if (letterOrWord.length === 1) {
        if (!letterHasAlreadyBeenInformed(letterOrWord)) {
            letterExist(letterOrWord)

            letters.push(letterOrWord)
            setLetters(letters)
            updateLettersOnDisplay()

            for (let i = 0; i < wordSplitted.length; i++) {
                if (wordSplitted[i] === letterOrWord)
                    awnser[i] = letterOrWord
            }

            setAwnser(awnser)
            wordDisplay.innerHTML = awnser.join(' ')
        } else
            alert('ATENÇÃO: Essa letra já foi informada!')
    } else {
        if (word === letterOrWord) {
            alert('Parabéns! Você acertou! 🥳')
            location.reload()
        } else {
            alert('Você errou! 😞 \nA resposta certa era: ' + word)
            location.reload()
        }
    }
}

form.addEventListener('submit', showLetter)