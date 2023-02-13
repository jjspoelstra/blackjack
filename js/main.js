//to do: 
//Make dealer draw if they can, even when player holds.
//Make dealer auto-win if they get blackjack
//make player auto-win if they get blackjack
//add winnings to local storage


//Initial Values


let playerCardArray = []    //for drawn cards
let botCardEstArray = []
let botRealArray = []
let score = 0         //display value of drawn cards
let botRealScore = 0
let botEstScore = 0
let deckId = ''       //to use same deck throughout game
let hits = 0          //how many times the pplayer has asked for another card
let aceLow = true     //default value, aces count as 1
let changingNum       //variable to allow aces to change between 1 and 11
let dealt = false     //default to false, changes to true once dealt
let loss = false      //check if player lost the game
let bet = 0           //initialize bet variable
let botDraw = true    //Boolean to allow bot to draw a card depending on score
let winnings = 0



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

  //update all-time bet scores
function adjustWinnings(){
    if (loss === true){
      winnings -= Number(bet)
      document.querySelector('.winnings').innerText = `Winnings: $${winnings}`
    }
    else {
      winnings += Number(bet)
      document.querySelector('.winnings').innerText = `Winnings: $${winnings}`
    }
}

    // shorthand to update the score
function updateScore(){
  score = playerCardArray.reduce((accum, card) => accum + card, 0)
        document.querySelector('.handScore').innerText = score
  botEstScore = botCardEstArray.reduce((accum, card) => accum + card, 1)
        document.querySelector('.botEstScore').innerText = `Minimum ${botEstScore}`
    botRealScore = botRealArray.reduce((accum, card) => accum + card, 0)
}

    //shorthand to check for a loss
function checkLoss(){
  if (score > 21){
    document.querySelector('.result').innerText = `You lost $${bet}.`
    loss = true
    adjustWinnings()
  }
  if (loss === true){
    let element = document.getElementById('restart')
    element.classList.toggle('hidden')
  }
}

function initializeBet(){
  bet = document.querySelector('.bet').value
  document.querySelector('.wagered').innerText = `Bet: $${bet}`
  document.querySelector('.bet').value = ''
}

function robotCheckIfDraw(){
  if (botRealScore <= 17 && (botRealArray.includes('1')) && botRealScore + 10 >= 17){
    botDraw = false
    dealerDraw()
  }
  else if (botRealScore >= 17){
    botDraw = false
    dealerDraw()
  }
  else {
    botDraw = true
  }
}

function dealerDraw() {
  document.querySelector('.botDraw').innerText = 'Dealer did not draw'
}



//event listeners

document.querySelector('#deal').addEventListener('click', dealCards)      //Initial deal 
document.querySelector('.hit').addEventListener('click', getHit)          //Hit
document.querySelector('.aceToggle').addEventListener('click', changeAce) //Change Ace Value 
document.querySelector('#restart').addEventListener('click', playAgain)   //Reset game
document.querySelector('.hold').addEventListener('click', compareValues)  //Player stops draws, compares score


//eventlistener functions


    //change whether ace is equal to 1 or 11. Default value is TRUE
function changeAce(){
  if (aceLow){
    aceLow = false
    document.querySelector('.aceToggle').innerText = 'Ace is High'
    changingNum = playerCardArray.indexOf(1)
    playerCardArray[changingNum] = 11
    updateScore()
    checkLoss()
  }
  else{
    aceLow = true
    document.querySelector('.aceToggle').innerText = 'Ace is Low'
    changingNum = playerCardArray.indexOf(11)
    playerCardArray[changingNum] = 1
    updateScore()
    checkLoss()
  }
    
}


    //Give player two cards to begin with               



    //want to deal to player first, then bot, then player, then bot. We can see the bot's second card only. Dealer must draw on 16 and less, stand on 17 or up. 

function dealCards(){
  const url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        if (dealt === false){
          //initializers
            dealt = true
            document.querySelector('.result').innerText = ''    //reset text to blank
            initializeBet()

          //player updates
            document.querySelector('#cardOne').src = data.cards[0].image
            document.querySelector('#cardTwo').src = data.cards[2].image
            playerCardArray.push(cardToValue(data.cards[0].value))
            playerCardArray.push(cardToValue(data.cards[2].value))

          //bot updates
            document.querySelector('#botCardTwo').src = data.cards[3].image
            botRealArray.push(cardToValue(data.cards[1].value))
            botRealArray.push(cardToValue(data.cards[3].value))
            botCardEstArray.push(cardToValue(data.cards[3].value))

          //update values
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
  const url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        hits++
          //check if first 2 have been dealt
        if (dealt === true){
              //initialize
                robotCheckIfDraw()

                //add more cards
              if (hits === 1 && score <= 21){

                  //player draw
                document.querySelector('#cardThree').src = data.cards[0].image
                playerCardArray.push(cardToValue(data.cards[0].value))
                
                  //bot draw
                if (botDraw === true){
                  document.querySelector('#botCardThree').src = data.cards[1].image
                  botRealArray.push(cardToValue(data.cards[1].value))
                  botCardEstArray.push(cardToValue(data.cards[1].value))
                }

                  //update values
                updateScore()
                checkLoss()

              }
              else if (hits === 2 && score <= 21){

                  //player draw
                document.querySelector('#cardFour').src = data.cards[0].image
                playerCardArray.push(cardToValue(data.cards[0].value))

                 //bot draw
                 if (botDraw === true){
                  document.querySelector('#botCardFour').src = data.cards[1].image
                  botRealArray.push(cardToValue(data.cards[1].value))
                  botCardEstArray.push(cardToValue(data.cards[1].value))
                }

                  //update values
                updateScore()
                checkLoss()
              }
              else if (hits === 3 && score <=21){

                  //player draw
                document.querySelector('#cardFive').src = data.cards[0].image
                playerCardArray.push(cardToValue(data.cards[0].value))

                 //bot draw
                 if (botDraw === true){
                  document.querySelector('#botCardFive').src = data.cards[1].image
                  botRealArray.push(cardToValue(data.cards[1].value))
                  botCardEstArray.push(cardToValue(data.cards[1].value))
                }

                  //update values
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


//compare values, determine who won the bet

///////*** NEED TO CODE ********* IF PLAYER HOLDS AND BOT IS STILL LESS THAN 17, BOT NEEDS TO DRAW UNTIL IT BUSTS OR HITS 17

function compareValues(){
  if (botRealScore > 21){
    document.querySelector('.result').innerText = `You won $${bet}.`
    loss = false
    adjustWinnings()
    let element = document.getElementById('restart')
    element.classList.toggle('hidden')
  }
  else if (botRealScore > score){
    document.querySelector('.result').innerText = `You lost $${bet}.`
    loss = true
    adjustWinnings()
    let element = document.getElementById('restart')
    element.classList.toggle('hidden')
  }
  else if (botRealScore === score){
    document.querySelector('.result').innerText = `You tied.`
    let element = document.getElementById('restart')
    element.classList.toggle('hidden')
  }
  else {
    document.querySelector('.result').innerText = `You won $${bet}.`
    lostt = false 
    adjustWinnings()
    let element = document.getElementById('restart')
    element.classList.toggle('hidden')
  }
  
}




    // play again (restart button)

function playAgain(){
  playerCardArray = []    //for drawn cards
  botCardEstArray = []
  botRealArray = []
  score = 0         //display value of drawn cards
  botRealScore = 0
  botEstScore = 0
  botDraw = true
  updateScore()
  hits = 0          //how many times the pplayer has asked for another card
  aceLow = true     //default value, aces count as 1
  changingNum       //variable to allow aces to change between 1 and 11
  dealt = false     //default to false, changes to true once dealt
  loss = false      //check if player lost the game
  bet = 0
  botDraw = true
  checkLoss()       //toggle start button off
  document.querySelector('.result').innerText = ''    //reset text to blank
  document.querySelector('#cardOne').src = ''
  document.querySelector('#cardTwo').src = ''
  document.querySelector('#cardThree').src = ''
  document.querySelector('#cardFour').src = ''
  document.querySelector('#cardFive').src = ''

  document.querySelector('.botEstScore').innerText = ''
  document.querySelector('.botDraw').innerText = ''
  document.querySelector('#botCardTwo').src = ''
  document.querySelector('#botCardThree').src = ''
  document.querySelector('#botCardFour').src = ''

  let element = document.getElementById('restart')
  element.classList.toggle('hidden')
  let dealhide = document.getElementById('deal')
  dealhide.classList.toggle('hidden')
  document.querySelector('.wagered').innerText = 'Bet:'
}






