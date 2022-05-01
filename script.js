//"use strict";

//Dropdown button:
let dropdownBtn = document.querySelector('.menu-btn');
let menuContent = document.querySelector('.menu-content');
dropdownBtn.addEventListener('click',()=>{
   if(menuContent.style.display===""){
      menuContent.style.display="block";
   } else {
      menuContent.style.display="";
   }
})


window.addEventListener('click',(e)=>{
  if(e.target != dropdownBtn){
    menuContent.style.display="";
  }
})
//End of dropdown

// The modal
var modal = document.getElementById("myModal"); // Get the modal
var span = document.getElementsByClassName("close")[0]; // Get the <span> element that closes the modal
var restartBtn = document.querySelector('.restart');

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
//window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

//End modal

//Player and selected mark:
const Player = (typePlayer,name,mark) => {
  let _mark = mark;
  let _typePlayer = typePlayer;

  const getType = () => _typePlayer;
  const setType = () => _typePlayer = typePlayer;

  let boolTurn;       //Is the turn of this player?
  if(mark === "X") boolTurn = true;     //First turn is player X
  else boolTurn = false;

  const getMark = () => _mark;          //Get the player mark
  const setMark = () => _mark = mark;   //Set the player mark

  function oneTurn(board,i){      //Need the board and the position for a mark
    board[i] = _mark;             //Put the mark on the position
  }

  //If you are playing against the random machine:
  function randomTurn(board){
    let fullBool = gameboard.every((e) => e != ''); //Boolean to check if the board is full
    let randIdx = Math.floor(Math.random()*9); //Aleatory number between 0 and 8
    while (gameboard[randIdx] != '' && !fullBool){          // If gameboard[aleatory number] isn't empty 
      randIdx = Math.floor(Math.random()*9);
    }
    board[randIdx] = _mark;
  }
  return {getMark,setMark,oneTurn,randomTurn, boolTurn, getType}
};

//Game. get the mode of the game 
const Game = (() => {

  function playMachine(player1,player2,i){
    player1.oneTurn(gameboard,i);     //Player movement
    Board.displayBoard();             //This is the gameBoard class.
    //setTimeout(verifyEnd,100);        //Need a timeout otherwise the alert shows faster and you can't see the movement.
    if(verifyEnd()){
      return };

    player2.randomTurn(gameboard);    //IA movement
    Board.disableBoard();       //Disable board for avoid several clicks and marks 
    setTimeout(()=>{      //Delay for put the IA mark
      Board.displayBoard();     //Show results
      Board.enableBoard(player1,player2);   //enable board again. //!!!
      setTimeout(verifyEnd,100);
    },600)
  }

  function playHumans(player1,player2, i){
    console.log('P1: '+ player1.getType() + ', P2: '+player2.getType() )
    if (player1.boolTurn){ 
      player1.oneTurn(gameboard, i);
      Board.disableBoard();
      Board.displayBoard();
      if(verifyEnd()){
        return };
      Board.enableBoard(player1,player2)
      player1.boolTurn = false;             //If you put a mark, you lost the turn
      player2.boolTurn = true;             //If you put a mark, you lost the turn
    }

    else if (player2.boolTurn) {
      player2.oneTurn(Board.gameboard, i);
      Board.disableBoard();
      Board.displayBoard();
      if(verifyEnd()){
        return };
      Board.enableBoard(player1,player2)
      player1.boolTurn = true;             //If you put a mark, you lost the turn
      player2.boolTurn = false;             //If you put a mark, you lost the turn
    };
  }

  function verifyEnd(){
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (cond of winConditions){  //One array of condition
      let row = ['','',''];
      for (let i = 0; i<cond.length; i++){    
        row[i] = Board.gameboard[cond[i]]
      }
      if (row.every((e) => e === 'X')){
        endGame('X wins!');
        return true;
      }
      else if(row.every((e) => e === 'O')){
        endGame('O Wins!');
        return true;
      } 
    }

    let fullBool = Board.gameboard.every((e) => e != ''); //Boolean to check if the board is full. False is not full, true is full
    if (fullBool){
      endGame('Tie');
      return true;
    }
  }

  function endGame(whoWins){
    document.querySelector('#end-msg').innerHTML = whoWins; 
    modal.style.display = "block";
    Board.disableBoard();
  }

  return { playHumans, playMachine };
})();


const Board = (()=> {
  gameboard = ['','','',    '','','',    '','',''];
  
  //Function to show the board on screen: 
  function displayBoard(){
    let cells = document.querySelectorAll('.cell'); //Select all cells
    for (let i=0; i<gameboard.length; i++){
      cells[i].innerHTML = gameboard[i];
    }
  }

  //Restart board function:
  function resetBoard(){
      for (let i = 0; i < gameboard.length; i++) {
        gameboard[i] = "";
      }
  }

  //allow click on Board:
  function enableBoard(player1,player2){
    let cells = document.querySelectorAll('.cell'); //Select all cells
    console.log(dropdownBtn.textContent);
    if(dropdownBtn.textContent === 'Two players'){ 
      mode = Game.playHumans
    }
    else if(dropdownBtn.textContent === 'Single player'){ 
      mode = Game.playMachine
    };
    //Add event lisener to put marks:
      for (let i=0; i<gameboard.length; i++){
        if(gameboard[i] != 'O' && gameboard[i] != 'X' ){
          cells[i].classList.add("active-cell");
          cells[i].addEventListener('click',()=>{
            console.log('P1: '+ player1.getType() + ', P2: '+player2.getType() )
            mode(player1,player2,i);
          });
        }
      }
  };

  function disableBoard(){
    let cells = document.querySelectorAll('.cell'); //Select all cells
    for (let i=0; i<gameboard.length; i++){
      cells[i].classList.remove("active-cell");
      var old_element = cells[i];
      var new_element = old_element.cloneNode(true);
      old_element.parentNode.replaceChild(new_element, old_element);
    }
  }

  return {gameboard, displayBoard, resetBoard, enableBoard, disableBoard}
})();


//Check the options in dropdown:
let P1 = Player('Human','Brayan','X');
let P2 = Player('IA','Juli','O');
let P3 = Player('Human','Juli','O');

Board.enableBoard(P1,P2);

//If you click one dropdown option, restart the game with this conditions:
menuContent.addEventListener('click',(e)=>{
  dropdownBtn.textContent = e.target.textContent
  Board.resetBoard();

  if(e.target.textContent=='Single player'){ 
    Board.enableBoard(P1,P2);
  }
  else{ 
    Board.enableBoard(player1=P1,player2=P3);
  };

  Board.displayBoard();
})

//Restart button:
restartBtn.onclick = function(e){
  Board.resetBoard();
  if(dropdownBtn.textContent=='Single player'){ 
    Board.enableBoard(P1,P2);
  }
  else{ 
    Board.enableBoard(P1,P3)
  };
  Board.displayBoard();
  modal.style.display = "none";
}
