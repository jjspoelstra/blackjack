
//Initial Values


let cardArray = []    //for drawn cards
let score = 0         //display value of drawn cards
let deckId = ''       //to use same deck throughout game
let hits = 0          //how many times the pplayer has asked for another card
let aceLow = true     //default value, aces count as 1
let changingNum       //variable to allow aces to change between 1 and 11
let dealt = false     //default to false, changes to true once dealt
let loss = false      //check if player lost the game


//Initial API Fetching
//Grabbing the deck id to use for the rest of the game

const url = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        deckId = data.deck_id
      })
      .catch(err => {
          console.log(`error ${err}`)
      });




//functions for later user

    //Make face cards have a numeric value
function cardToValue(card){
  if (card === 'ACE'){
      if (aceLow == true){
        return 1
      } else {
        return 11
      } 
  }
  else if (card === 'KING' || card === 'QUEEN' || card === 'JACK'){
    return 10
  }
  else {
    return Number(card)
  }
}

    // shorthand to update the score
function updateScore(){
  score = cardArray.reduce((accum, card) => accum + card, 0)
        document.querySelector('.handScore').innerText = score
}

    //shorthand to check for a loss
function checkLoss(){
  if (score > 21){
    document.querySelector('.result').innerText = 'You Lose!'
    loss = true
  }
  if (loss === true){
    let element = document.getElementById('restart')
    element.classList.toggle('hidden')
  }
}


//event listeners

document.querySelector('#deal').addEventListener('click', dealCards)      //deal listener
document.querySelector('.hit').addEventListener('click', getHit)          //hit listener
document.querySelector('.aceToggle').addEventListener('click', changeAce) //ace change listener
document.querySelector('#restart').addEventListener('click', playAgain)



//eventlistener functions


    //change whether ace is equal to 1 or 11. Default value is TRUE
function changeAce(){
  if (aceLow){
    aceLow = false
    document.querySelector('.aceToggle').innerText = 'Ace is High'
    changingNum = cardArray.indexOf(1)
    cardArray[changingNum] = 11
    updateScore()
    checkLoss()
  }
  else{
    aceLow = true
    document.querySelector('.aceToggle').innerText = 'Ace is Low'
    changingNum = cardArray.indexOf(11)
    cardArray[changingNum] = 1
    updateScore()
    checkLoss()
  }
    
}


    //Give player two cards to begin with

function dealCards(){
  const url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        if (dealt === false){
          document.querySelector('.result').innerText = ''    //reset text to blank
          dealt = true
          document.querySelector('#cardOne').src = data.cards[0].image
          document.querySelector('#cardTwo').src = data.cards[1].image
          cardArray.push(cardToValue(data.cards[0].value))
          cardArray.push(cardToValue(data.cards[1].value))
          updateScore()
          checkLoss()
          let element = document.getElementById('deal')
          element.classList.toggle('hidden')
        }
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}



    //If player chooses to "hit", they press this button

function getHit(){
  const url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        hits++
          //check if first 2 have been dealt
        if (dealt === true){
                //add more cards
              if (hits === 1 && score <= 21){
                document.querySelector('#cardThree').src = data.cards[0].image
                cardArray.push(cardToValue(data.cards[0].value))
                updateScore()
                checkLoss()
              }
              else if (hits === 2 && score <= 21){
                document.querySelector('#cardFour').src = data.cards[0].image
                cardArray.push(cardToValue(data.cards[0].value))
                updateScore()
                checkLoss()
              }
              else if (hits === 3 && score <=21){
                document.querySelector('#cardFive').src = data.cards[0].image
                cardArray.push(cardToValue(data.cards[0].value))
                updateScore()
                checkLoss()
              }   
        } else {
              document.querySelector('.result').innerText = 'Deal first!'    //reset text to blank
        }
           
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
  }


    // play again (restart button)

function playAgain(){
  cardArray = []    //for drawn cards
  score = 0         //display value of drawn cards
  updateScore()
  hits = 0          //how many times the pplayer has asked for another card
  aceLow = true     //default value, aces count as 1
  changingNum       //variable to allow aces to change between 1 and 11
  dealt = false     //default to false, changes to true once dealt
  loss = false      //check if player lost the game
  checkLoss()       //toggle start button off
  document.querySelector('.result').innerText = ''    //reset text to blank
  document.querySelector('#cardOne').src = ''
  document.querySelector('#cardTwo').src = ''
  document.querySelector('#cardThree').src = ''
  document.querySelector('#cardFour').src = ''
  document.querySelector('#cardFive').src = ''
  let element = document.getElementById('restart')
  element.classList.toggle('hidden')
  let dealhide = document.getElementById('deal')
  dealhide.classList.toggle('hidden')
}