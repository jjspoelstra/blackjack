//to do: 

//bot 1st card will sometimes not return to hidden on restart
//bot will not auto-lose when they bust
//player can click hold over and over and bet will continue reapplying
//holding and coming up with a tie results in a player win
//aces confuse dealer, will draw and then lose on 7-A-A because it counts as 9 instead of 19.
//dealer will draw on 17 when they have a lower score

//eventListeners


//objects

class Scores {  //scores for user and dealer established here
  constructor(){
    this.cardArray = []   //for drawn cards
  }
  get score(){
    return this.cardArray.reduce((accum, card) => accum + card, 0)  //reduce array to a score
  }
}

class Dealer extends Scores{  //give dealer their own properties and methods in addition to the scores
  constructor(){
    super()
    this.draw = true                               //boolean to allow bot to draw a card depending on score
    this.dealt = false
  }
  get estimatedScore(){ //displays value of dealer's shown cards
    return this.cardArray.slice(1).reduce((accum,card) => accum + card, 1)  
  }
  get estimatedArray() { //removes invisible card from array
    this.cardArray.shift()
  }   
  dealCards(){
      fetch(`https://deckofcardsapi.com/api/deck/${gameState.deckId}/draw/?count=4`)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
          //initializers
            document.querySelector('.result').innerText = ''    //reset text to blank
          //player updates
            document.querySelector('#cardOne').src = data.cards[0].image
            document.querySelector('#cardTwo').src = data.cards[2].image
            user.cardArray.push(gameState.cardToValue(data.cards[0].value))
            user.cardArray.push(gameState.cardToValue(data.cards[2].value))
          //bot updates
            document.querySelector('#botCardOne').src = data.cards[1].image
            document.querySelector('#botCardTwo').src = data.cards[3].image
            dealer.cardArray.push(gameState.cardToValue(data.cards[1].value))
            dealer.cardArray.push(gameState.cardToValue(data.cards[3].value))
          //update values
            gameState.updateScore()
            gameState.dealElement.classList.toggle('hidden')
        }
      )
      .catch(err => {
      console.log(`error ${err}`)
      })
    }
}

//ADD TO DEALER OBJECTS 

  // //this tells the player if the dealer drew
  // function dealerDraw() {
  //   document.querySelector('.botDraw').innerText = 'Dealer did not draw'
  // }

    //this checks if the dealer is able to draw another card
// function robotCheckIfDraw(){
//   if (botRealScore <= 17 && (botRealArray.includes(1)) && botRealScore + 10 >= 17){
//     botDraw = false
//     dealerDraw()
//   }
//   else if (botRealScore >= 17){
//     botDraw = false
//     dealerDraw()
//   }
//   else {
//     botDraw = true
//   }
// }
  
  //   //shows the hidden card after the hand is over
  // function showDealerCards(){
  //   document.getElementById('botCardOne').classList.toggle('hidden')
  // }


class Player extends Scores{  //give player their own properties and methods in addition to the scores
  constructor(){
    super()
    this.hits = 0                                        //how many times the player has asked for another card
    this.bet //document.querySelector('.bet').value      //how much the player has bet
    this.winnings = +localStorage.getItem('winnings')    //how much the player has won/lost in the past
  }
}

   

class GameEngine { //establishes baseline rules for the game state
  constructor() {
    this.deckId 
    this.aceValue = 1
    this.dealElement = document.getElementById('deal')
  }
  cardToValue(card){ //Make face cards have a numeric value
  if (card === 'ACE'){
      return this.aceValue === 1 ? 1 : 11
  } else if (card === 'KING' || card === 'QUEEN' || card === 'JACK'){
      return 10
    } else {
      return Number(card)
      }
  }
  updateScore(){
    document.querySelector('.handScore').innerText = user.score
    document.querySelector('.botEstScore').innerText = `Minimum ${dealer.estimatedScore}`
    // if(user.score === 21){
    //   compareValues()
    //   showDealerCards()
    // }
  }
  changeAce(){ //change whether ace is equal to 1 or 11. Default value is TRUE
    if (this.aceValue = 1){
      this.aceValue = 11
      document.querySelector('.aceToggle').innerText = 'Ace is High'
      user.cardArray[user.cardArray.indexOf(1)] = 11
      gameState.updateScore()
    }
    else {
      this.aceValue = 1
      document.querySelector('.aceToggle').innerText = 'Ace is Low'
      user.cardArray[user.cardArray.indexOf(11)] = 1
      gameState.updateScore()
    }
  }
}

fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1' )   //Initial API Fetching, deck ID to use for remainder of game
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      gameState.deckId = data.deck_id
    })
    .catch(err => {
        console.log(`error ${err}`)
    });

const gameState = new GameEngine()
const user = new Player()
const dealer = new Dealer()


//event listeners
document.querySelector('#deal').addEventListener('click', dealer.dealCards)      //Initial deal
document.querySelector('.aceToggle').addEventListener('click', gameState.changeAce) //change ace value

 
document.querySelector('.hit').addEventListener('click', getHit)          //Hit
document.querySelector('#restart').addEventListener('click', playAgain)   //Reset game
document.querySelector('.hold').addEventListener('click', compareValues)  //Player stops draws, compares score

     


            
 

//next up



            
//CHANGED VARIABLES
    
//botRealScore ---> dealer.score
//botRealArray ---> dealer.cardArray
//botEstScore ---> dealer.estimatedScore
//botCardEstArray ---> dealer.estimatedArray
//botDraw ---> dealer.draw


//FIX LATER

// adjustWinnings(){
//   if (loss === true){
//     winnings -= Number(bet)
//     document.querySelector('.winnings').innerText = `Winnings: $${winnings}`
//     localStorage.setItem('winnings', winnings.toString()) 
//   }
//   else {
//     winnings += Number(bet)
//     document.querySelector('.winnings').innerText = `Winnings: $${winnings}`
//     localStorage.setItem('winnings', winnings.toString()) 
//   }
// }





    //shorthand to check for a loss
function checkLoss(){
  if (score > 21 || ((botRealScore === 21 || (botRealArray.includes(1) && botRealScore + 10 === 21)) && score != 21)){
    document.querySelector('.result').innerText = `You lost $${bet}.`
    loss = true
    adjustWinnings()
    showDealerCards()
    if (botRealArray.includes(1) && botRealScore + 10 === 21){
      document.querySelector('.botEstScore').innerText = +botRealScore + 10
    }
    else{
      document.querySelector('.botEstScore').innerText = botRealScore
    }
  }
  if (loss === true){
    let element = document.getElementById('restart')
    element.classList.toggle('hidden')
  }
}

  //places bet into the pot
function initializeBet(){
  bet = document.querySelector('.bet').value
  document.querySelector('.wagered').innerText = `Bet: $${bet}`
  document.querySelector('.bet').value = ''
}










//eventlistener functions




    //Give player two cards to begin with               




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
                robotCheckIfDraw()

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
                robotCheckIfDraw()
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
                robotCheckIfDraw()
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



function compareValues(){
  if (dealt === false){
    document.querySelector('.result').innerText = 'Deal first!'
  }
  else {
    if (botRealScore > 21){
      document.querySelector('.result').innerText = `You won $${bet}.`
      loss = false
      adjustWinnings()
      document.querySelector('.botEstScore').innerText = botRealScore
      showDealerCards()
      let element = document.getElementById('restart')
      element.classList.toggle('hidden')
    }
    else if (botRealScore > score){
      document.querySelector('.result').innerText = `You lost $${bet}.`
      loss = true
      adjustWinnings()
      document.querySelector('.botEstScore').innerText = botRealScore
      showDealerCards()
      let element = document.getElementById('restart')
      element.classList.toggle('hidden')
    }
    else if (botRealScore === score && botDraw === false){
      document.querySelector('.result').innerText = `You tied.`
      document.querySelector('.botEstScore').innerText = botRealScore
      showDealerCards()
      let element = document.getElementById('restart')
      element.classList.toggle('hidden')
    }
    else if ((botRealScore < score || botEstScore === score) && botDraw === true && score !=21){
      const botUrl = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
  
       fetch(botUrl)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
            if (botRealArray.length === 2){
              document.querySelector('#botCardThree').src = data.cards[0].image
            }
            else if(botRealArray.length === 3){
              document.querySelector('#botCardFour').src = data.cards[0].image
            }
            botRealArray.push(cardToValue(data.cards[0].value))
            botCardEstArray.push(cardToValue(data.cards[0].value)) 
            updateScore()
            checkLoss()
            compareValues()
            document.querySelector('.botEstScore').innerText = botRealScore
            
        })
        .catch(err => {
          console.log(`error ${err}`)
      })
    }
  
    else{
      document.querySelector('.result').innerText = `You won $${bet}.`
      loss = false 
      adjustWinnings()
      document.querySelector('.botEstScore').innerText = botRealScore
      showDealerCards()
      let element = document.getElementById('restart')
      element.classList.toggle('hidden')
    }
      
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
        //toggle start button off
  showDealerCards()
  document.querySelector('.result').innerText = ''    //reset text to blank
  document.querySelector('#cardOne').src = ''
  document.querySelector('#cardTwo').src = ''
  document.querySelector('#cardThree').src = ''
  document.querySelector('#cardFour').src = ''
  document.querySelector('#cardFive').src = ''

  document.querySelector('.botEstScore').innerText = ''
  document.querySelector('.botDraw').innerText = ''
  document.querySelector('#botCardOne').src = ''
  document.querySelector('#botCardTwo').src = ''
  document.querySelector('#botCardThree').src = ''
  document.querySelector('#botCardFour').src = ''
 

  let element = document.getElementById('restart')
  element.classList.toggle('hidden')
  let dealhide = document.getElementById('deal')
  dealhide.classList.toggle('hidden')
  document.querySelector('.wagered').innerText = 'Bet:'

  
    //reshuffle the same deck
  fetch( `https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        deckId = data.deck_id
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
 


}






