//to do: 


//add insurance
//add split bets


//get winnings history
if (!localStorage.getItem('winnings') || localStorage.getItem('winnings') === 'NaN'){
  localStorage.setItem('winnings', 0)
} else {
  document.querySelector('.winnings').innerText = `Balance: $${localStorage.getItem('winnings')}`
}


//objects

class Scorer {  //scores for user and dealer established here
  constructor(){
    this.cardArray = []   //for drawn cards
    this.draw = true      //determines whether they are able to draw new cards, depending on their score
    this.aceValue = 1     //default for both user and dealer is 1
  }
  get score(){
    return this.cardArray.reduce((accum, card) => accum + card, 0)  //reduce array to a score
  }
}


class Dealer extends Scorer{  //give dealer their own properties and methods in addition to the scores
  constructor(){
    super()
    this.dealt = false
    this.message = "First place a bet, then deal"
  }
  get estimatedScore(){ //displays value of dealer's shown cards
    return this.cardArray.slice(1).reduce((accum,card) => accum + card, 1)  
  } 
  get drawState(){
    if (this.score < 17 || (this.cardArray.includes(1) && this.score + 10 < 17)){   //DOUBLE CHECK ACE RULES FOR DEALER
      return this.draw
    } else {
      return false
    }
  }
  dealCards(){
      dealer.dealt = true
      fetch(`https://deckofcardsapi.com/api/deck/${gameState.deckId}/draw/?count=4`)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data) 
          //initializers
            user.bet()
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
            gameState.checkWin()
            gameState.dealElement.classList.toggle('hidden')
        }
      )
      .catch(err => {
      console.log(`error ${err}`)
      })
    }
  hit(){
    const url = `https://deckofcardsapi.com/api/deck/${gameState.deckId}/draw/?count=2`
      fetch(url)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
          console.log(data)
          user.hits++
              
            if (dealer.dealt === true && user.draw === true){
              document.querySelector(`#card${user.hits+2}`).src = data.cards[0].image
              user.cardArray.push(gameState.cardToValue(data.cards[0].value))
              gameState.updateScore()
                if (dealer.drawState === true){
                  document.querySelector(`#botCard${user.hits+2}`).src = data.cards[1].image
                  dealer.cardArray.push(gameState.cardToValue(data.cards[1].value))
                  gameState.updateScore()
                  gameState.checkWin()
                }
                else {
                  gameState.checkWin()
                }
            } else if (user.draw === false && dealer.drawState === true){
                document.querySelector(`#botCard${user.hits+2}`).src = data.cards[0].image
                dealer.cardArray.push(gameState.cardToValue(data.cards[0].value))
                gameState.updateScore()
                gameState.checkWin()
                  if ( dealer.drawState === true){
                    dealer.hit()
                  }
            } else if (dealer.dealt === false){
                alert (dealer.message)    
            } else {
                gameState.updateScore()
                gameState.checkWin()
                }
               
        })
          .catch(err => {
              console.log(`error ${err}`)
          });
      }
}


class Player extends Scorer{  //give player their own properties and methods in addition to the scores
  constructor(){
    super()
    this.hits = 0                                        //how many times the player has asked for another card
    this.betAmount                                       //how much the player has bet
    this.winnings = +localStorage.getItem('winnings')    //how much the player has won/lost in the past
    this.outcome = undefined                             //won or lost?
  }
  bet(){
      this.betAmount = `${+document.querySelector('.bet').value}`
      document.querySelector('.wagered').innerText = `Bet: $${this.betAmount}`
    }
  stand(){
    if (dealer.dealt === false) {
      alert ('Please place a bet and deal')
    }
    else {
      user.draw = false
      dealer.hit()
    }
  }
  changeAce(){ //change whether ace is equal to 1 or 11. Default value is TRUE
    if (user.aceValue === 1){
      user.aceValue = 11
      document.querySelector('.aceToggle').innerText = 'Ace is High'
      user.cardArray[user.cardArray.indexOf(1)] = 11
      gameState.updateScore()
      gameState.checkWin()
    }
    else {
      user.aceValue = 1
      document.querySelector('.aceToggle').innerText = 'Ace is Low'
      user.cardArray[user.cardArray.indexOf(11)] = 1
      gameState.updateScore()
      gameState.checkWin()
    }
  }
}

   
class GameEngine { //establishes baseline rules for the game state
  constructor() {
    this.deckId 
    this.aceDefault = 1
    this.dealElement = document.getElementById('deal')
    this.hiddenCard = document.getElementById('botCardOne').classList
  }
  cardToValue(card){ //Make face cards have a numeric value
  if (card === 'ACE'){
      return this.aceDefault
  } else if (card === 'KING' || card === 'QUEEN' || card === 'JACK'){
      return 10
    } else {
      return Number(card)
      }
  }
  updateScore(){
    document.querySelector('.handScore').innerText = user.score
    document.querySelector('.dealerScore').innerText = `Minimum ${dealer.estimatedScore}`
    // if(user.score === 21){
    //   compareValues()
    //   showDealerCards()
    // }
  }
  checkWin(){ //cleanUP. Potentially switch-case statements. Lots of redundant code here.
    if (user.score > 21){
      user.outcome = 'loss'
      this.hiddenCard.toggle('hidden')
      document.querySelector('.dealerScore').innerText = dealer.score
      this.checkWinnings()
    } 
    else if (dealer.score === 11 && dealer.cardArray.includes(1)){
      user.outcome = 'loss'
      dealer.cardArray.push(10)
      this.hiddenCard.toggle('hidden')
      document.querySelector('.dealerScore').innerText = dealer.score
      this.checkWinnings()
    }
    else if (user.score === 11 && user.cardArray.includes(1)){
      user.outcome = 'win'
      user.score += 10
      this.hiddenCard.toggle('hidden')
      document.querySelector('.dealerScore').innerText = dealer.score
      this.checkWinnings()
    }
    else if (user.score === 21 && dealer.score != 21){
      user.outcome = 'win'
      this.hiddenCard.toggle('hidden')
      document.querySelector('.dealerScore').innerText = dealer.score
      this.checkWinnings()
    }
    else if (user.score <= 21 && dealer.score > 21){
      user.outcome = 'win'
      this.hiddenCard.toggle('hidden')
      document.querySelector('.dealerScore').innerText = dealer.score
      this.checkWinnings()
    }
    else if (dealer.drawState === false && user.draw === false && user.score === dealer.score){
      user.outcome = 'tie'
      this.hiddenCard.toggle('hidden')
      document.querySelector('.dealerScore').innerText = dealer.score
      this.checkWinnings()
    }
    else if (dealer.drawState === false && user.draw === false && user.score < dealer.score){
      user.outcome = 'loss'
      this.hiddenCard.toggle('hidden')
      document.querySelector('.dealerScore').innerText = dealer.score
      this.checkWinnings()
    }
    else if (dealer.drawState === false && user.draw === false && user.score > dealer.score ){
      user.outcome = 'win'
      this.hiddenCard.toggle('hidden')
      document.querySelector('.dealerScore').innerText = dealer.score
      this.checkWinnings()
    }
  }
  checkWinnings(){
    if (user.outcome === 'win'){
      document.getElementById('restart').classList.toggle('hidden')
      document.getElementById('hold').classList.toggle('hidden')
      if (user.cardArray.length === 2 && user.draw === true){
          user.betAmount *=1.5
          document.getElementById('blackjack').style.color = 'blue'
      }
      document.querySelector('.result').innerText = `You won $${user.betAmount}.`
        
      user.winnings += Number(user.betAmount)
      document.querySelector('.winnings').innerText = `Winnings: $${user.winnings}`
      localStorage.setItem('winnings', user.winnings.toString()) 
    }
    else if (user.outcome === 'loss'){
      document.getElementById('restart').classList.toggle('hidden')
      document.getElementById('hold').classList.toggle('hidden')
      document.querySelector('.result').innerText = `You lost $${user.betAmount}.`
      user.winnings -= Number(user.betAmount)
      document.querySelector('.winnings').innerText = `Winnings: $${user.winnings}`
      localStorage.setItem('winnings', user.winnings.toString()) 
    }
    else if (user.outcome === 'tie'){
      document.getElementById('restart').classList.toggle('hidden')
      document.getElementById('hold').classList.toggle('hidden')
      document.querySelector('.result').innerText = `You tied.`
    }
  }
  playAgain(){  //restart game
    location.reload()
  }
}

//Generate start of game
fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1' )   //Initial API Fetching, deck ID to use for remainder of game
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      gameState.deckId = data.deck_id
    })
    .catch(err => {
        console.log(`error ${err}`)
    });

let gameState = new GameEngine()
let user = new Player()
let dealer = new Dealer()


//event listeners
document.querySelector('#deal').addEventListener('click', dealer.dealCards)      //Initial deal
document.querySelector('.aceToggle').addEventListener('click', user.changeAce) //change ace value
document.querySelector('#restart').addEventListener('click', gameState.playAgain)   //Reset game
document.querySelector('.hit').addEventListener('click', dealer.hit)          //Hit
document.querySelector('#hold').addEventListener('click', user.stand)   //Player stops draws, compares score