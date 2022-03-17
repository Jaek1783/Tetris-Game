// dom
const startBtn = document.querySelector(".play");
const speedUp= document.querySelector(".speedUp");
const speedDown = document.querySelector(".speedDown");
const playground = document.querySelector(".playground>ul");
const gameText = document.querySelector(".game-text");
const scoreDisplay = document.querySelector(".score");

// setting
const game_rows = 22;
const game_cols = 10;

// variables
let score = 0;
let downInterval;
let tempMovingItem;
const duration=250;
const blocks = {
  square:[
    [[0,0],[0,1],[1,0],[1,1]],
    [[0,0],[0,1],[1,0],[1,1]],
    [[0,0],[0,1],[1,0],[1,1]],
    [[0,0],[0,1],[1,0],[1,1]],
  ],
  bar:[
    [[1,0],[2,0],[3,0],[4,0]],
    [[2,-1],[2,0],[2,1],[2,2]],
    [[1,0],[2,0],[3,0],[4,0]],
    [[2,-1],[2,0],[2,1],[2,2]],
  ],
  tree:[
    [[2,1],[0,1],[1,0],[1,1]],
    [[1,2],[0,1],[1,0],[1,1]],
    [[1,2],[0,1],[2,1],[1,1]],
    [[2,1],[1,2],[1,0],[1,1]],
  ],
  lZee:[
    [[0,0],[1,0],[1,1],[2,1]],
    [[0,1],[1,0],[1,1],[0,2]],
    [[0,1],[1,1],[1,2],[2,2]],
    [[2,0],[2,1],[1,1],[1,2]],
  ],
  rZee:[
    [[0,1],[1,1],[1,0],[2,0]],
    [[0,0],[0,1],[1,1],[1,2]],
    [[0,2],[1,2],[1,1],[2,1]],
    [[1,0],[1,1],[2,1],[2,2]],
  ],
  elLeft:[
    [[0,0],[0,1],[1,1],[2,1]],
    [[1,0],[1,1],[1,2],[0,2]],
    [[0,1],[1,1],[2,1],[2,2]],
    [[1,0],[1,1],[1,2],[2,0]],
  ],
  elRight:[
    [[0,1],[0,2],[1,1],[2,1]],
    [[1,0],[1,1],[1,2],[2,2]],
    [[2,0],[0,1],[1,1],[2,1]],
    [[0,0],[1,0],[1,1],[1,2]],
  ],
}
const movingItem = {
  type: "",
  direction: 0,
  top:0,
  left:0,
};
// 보드판 만들기
init()
// functions
function init(){
  tempMovingItem = { ...movingItem };
  for (let i = 0; i < game_rows; i++){
    prependNewLine();
  }
startBtn.addEventListener("click",()=>{
    // console.log(playClick);
  generateNewBlock();
  gameText.style.display = "none"
  startBtn.style.display = "none"
  // pauseBtn.style.display = "block"
});
}
function prependNewLine(){
  const li = document.createElement("li");
  const ul = document.createElement("ul");
  for (let j = 0; j < game_cols; j++){
    const matrix = document.createElement("li");
    ul.prepend(matrix);
  }
    li.prepend(ul);
    playground.prepend(li);
}
// 보드판 만들기 끝
// 모양 돌리기
function renderBlocks(moveType=""){
  const {type,direction,top,left}=tempMovingItem;
  const movingBlocks = document.querySelectorAll(".moving");
  movingBlocks.forEach(moving =>{
    moving.classList.remove(type,"moving");
  });
  blocks[type][direction].some(block=>{
    const x = block[0] + left;
    const y  = block[1] + top;
    // 조건 ? 참일경우 : 거짓일 경우
    // console.log(playground.childNodes[y]);
    const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
    const isAvailable = checkEmpty(target);
    if(isAvailable){
      target.classList.add(type, "moving");
    } else{
      tempMovingItem = { ...movingItem };
      if(moveType === 'retry'){
        clearInterval(downInterval);
        showGameoverText()
      }
      setTimeout(()=>{
        renderBlocks('retry');
        if (moveType ==="top"){
          seizeBlock();
        }
      },0);
      return true;
    }
  });
  movingItem.left = left;
  movingItem.top = top;
  movingItem.direction = direction;
}
// 모양돌리기 끝
// 벽만들기
function seizeBlock(){
  const movingBlocks = document.querySelectorAll(".moving");
  movingBlocks.forEach(moving =>{
    moving.classList.remove("moving");
    moving.classList.add("seized");
  });
  checkMatch();
  // generateNewBlock();
}
function checkMatch(){
  const childNodes = playground.childNodes;
  childNodes.forEach(child => {
    let matched = true;

    child.children[0].childNodes.forEach(li => {
      if(!li.classList.contains("seized")){
        matched = false;
      }
    });
      if(matched){
        child.remove();
        prependNewLine();
        score++;
        scoreDisplay.innerText = score*100;
      }
  });
    generateNewBlock();
}
// 새로운 블럭 만들기
function generateNewBlock(){
  clearInterval(downInterval);
  downInterval = setInterval(()=>{
    moveBlock('top',1)
  },duration);
        const blockArray = Object.entries(blocks);
        const randomBlock = Math.floor(Math.random()*blockArray.length);
        const nextBlock = Math.floor(Math.random()*blockArray.length);
        console.log(randomBlock);
        console.log(nextBlock);
      movingItem.type = blockArray[randomBlock][0];
      movingItem.top = 0;
      movingItem.left = 3;
      movingItem.direction = 0;
      tempMovingItem = { ...movingItem };
      renderBlocks();
    }
    // 새로운 블럭 만들기 끝
// 한줄채우면 사라지기
function checkEmpty(target){
  if(!target || target.classList.contains("seized")){
    return false;
  }
  else{
    return true;
  }
}

function moveBlock(moveType, amount){
  tempMovingItem[moveType] += amount;
  renderBlocks(moveType);
}
function changeDirection(){
  const direction = tempMovingItem.direction;
  direction === 3 ? tempMovingItem.direction =0 : tempMovingItem.direction +=1;
  renderBlocks();
}
// 블럭 자동 내리기
function dropBlock(){
  clearInterval(downInterval);
  downInterval = setInterval(()=>{
    moveBlock("top",1);
  },10);
}
// 게임오버 시 작동
function showGameoverText(){
  gameText.style.display = "flex"
  const gameT = document.querySelector(".gameT");
  console.log(gameT);
  if(gameT != null){
    gameT.innerText = "Game Over"
  }
  startBtn.style.display = "inline-block"
}
// event.handling 키보드 작동
document.addEventListener("keydown", e =>{
  switch(e.keyCode){
    case 39:
      moveBlock("left", 1);
      break;
    case 37:
    moveBlock("left",-1);
    break;
    case 40:
      moveBlock("top", 1);
      break;
    case 38:
      changeDirection();
      break;
    case 32:
      dropBlock();
      break;
  default:
    break;
  }
});
