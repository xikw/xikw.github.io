let board = [];
let score = 0;
let hasConflicted=[];

let startx=0;
let starty=0;
let endx=0;
let endy=0;

$(document).ready(function (){
    prepareForMobile();
    newGame();
});

function  prepareForMobile(){

    if(documentWidth>500){
        gridContainerWidth=500;
        cellSpace=20;
        cellSideLength=100;
    }

    $('#grid-container').css('width',gridContainerWidth-2*cellSpace);
    $('#grid-container').css('height',gridContainerWidth-2*cellSpace);
    $('#grid-container').css('padding',cellSpace);
    $('#grid-container').css('border-radius',0.02*gridContainerWidth);

    $('.grid-cell').css('width',cellSideLength);
    $('.grid-cell').css('height',cellSideLength);
    $('.grid-cell').css('border-radius',0.02*cellSideLength);

}

function newGame(){
    //初始化棋盘
    init();
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

function init(){
    for( let i=0;i<4;i++)
        for( let j=0;j<4;j++){
            let gridCell=$('#grid-cell-'+i+"-"+j);
            gridCell.css('top',getPosTop(i,j));
            gridCell.css('left',getPosLeft(i,j));
        }

    for(let i=0;i<4;i++){
        board[i]=[];
        hasConflicted[i]=[];
        for(let j=0;j<4;j++){
            board[i][j]=0;
            hasConflicted[i][j]=false;
        }

    }

    updateBoardView();
    score=0;
    updateScore(score);
}

function updateBoardView(){
    $(".number-cell").remove();
    for(let i=0;i<4;i++)
        for(let j=0; j<4; j++){
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            let theNumberCell = $('#number-cell-'+i+'-'+j);

            if(board[i][j]===0){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j)+cellSideLength/2);
                theNumberCell.css('left',getPosLeft(i,j)+cellSideLength/2);
            }
            else{
                theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getBC(board[i][j]));
                theNumberCell.css('color',getC(board[i][j]));
                theNumberCell.text(board[i][j]);
            }

            hasConflicted[i][j]=false;
        }
    $('.number-cell').css('line-height',cellSideLength+'px');
    $('.number-cell').css('font-size',0.6*cellSideLength+'px');
}

function generateOneNumber(){
    if(noSpace(board))
        return false;

    //随机一个位置
    let randX=parseInt(Math.floor(Math.random() * 4));
    let randY=parseInt(Math.floor(Math.random() * 4));

    let times=0;
    while(times<50){
        if(board[randX][randY]===0)
            break;
        randX=parseInt(Math.floor(Math.random()*4));
        randY=parseInt(Math.floor(Math.random()*4));
        times++;
    }
    if(times==50){
        for(let i=0;i<4;i++)
            for(let j=0; j<4; j++) {
                if(board[i][j]==0){
                    randX=i;
                    randY=j;
                }
            }
    }

    //随机一个数字
    let randNumber=Math.random()<0.5 ? 2:4;

    //在随机位置显示随机数字
    board[randX][randY]=randNumber;
    showNumber(randX,randY,randNumber);

    return true;
}

$(document).keydown(function (event){

    switch (event.keyCode){
        case 37://左
            //屏蔽默认反应；
            event.preventDefault();
            if(moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        case 38://上
            //屏蔽默认反应；
            event.preventDefault();
            if(moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        case 39://右
            //屏蔽默认反应；
            event.preventDefault();
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        case 40://下
            //屏蔽默认反应；
            event.preventDefault();
            if(moveDown()){
               setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
    }
})

document.addEventListener('touchstart',function (event){
    startx=event.touches[0].pageX;
    starty=event.touches[0].pageY;
})

document.addEventListener('touchmove',function (event){
    event.preventDefault();
})

document.addEventListener('touchend',function (event){
    endx=event.changedTouches[0].pageX;
    endy=event.changedTouches[0].pageY;

    let deltax=endx-startx;
    let deltay=endy-starty;

    //判断是否为滑动，屏蔽点击事件
    if(Math.abs(deltax)<0.2*documentWidth && Math.abs(deltay)<0.2*documentWidth)
        return;
    //x
    if(Math.abs(deltax)>=Math.abs(deltay)){
        if(deltax>0){
            //move right
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
        }
        else{
            //move left
            if(moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
        }
    }//y
    else{
        //move down
        if(deltay>0){
            if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }

        }
        //move up
        else{
            if(moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
        }
    }
})

function isGameOver(){
    if(noSpace(board) && noMove(board)){
        gameOver();
    }
}

function gameOver(){
    alert('游戏结束!')
}

function moveLeft(){
    if(!canMoveLeft(board))
        return false;
    //let board1=board.slice();
     //深拷贝
    //let board1=newCopy(board);
    //moveLeft
    for(let i=0;i<4;i++)
        for(let j=1; j<4; j++){
            if(board[i][j]!=0){
                for(let k=0;k<j;k++){
                    if(board[i][k]==0 && noBlockHorizontal(i,k,j,board)){
                        //move
                        showMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if(board[i][k]==board[i][j] && noBlockHorizontal(i,k,j,board) && !hasConflicted[i][k]){
                        //if(board[i][k]<=2*(board1[i][k])) {
                            //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score+=board[i][k];
                        updateScore(score);
                        //}
                        hasConflicted[i][k]=true;
                        continue;
                    }
                }
            }
        }
    setTimeout('updateBoardView()',200);
    return true;
}

function moveRight(){
    if(!canMoveRight(board))
        return false;
    //浅拷贝，不行  let board1=board.slice();

    //let board1=board.slice();
    //let board1=newCopy(board);

    //moveRight
    for(let i=0;i<4;i++) {
        for (let j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                for (let k = 3; k > j; k--) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
                        //if(board[i][k]<=2*(board1[i][k])) {
                            //move
                            showMoveAnimation(i, j, i, k);
                            //add
                            board[i][k] += board[i][j];
                            board[i][j] = 0;
                            score+=board[i][k];
                            updateScore(score);
                        //}
                        hasConflicted[i][k]=true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout('updateBoardView()',200);
    return true;
}

function moveDown(){
    if(!canMoveDown(board))
        return false;
    //moveDown,默认j代表列，i代表行
    //let board1=board.slice();

    //let board1=newCopy(board);
    for(let j=0;j<4;j++)
        for(let i=2; i>=0; i--){
            if(board[i][j]!=0){
                for(let k=3;k>i;k--){
                    if(board[k][j]==0 && noBlockVertical(j,i,k,board) ){
                        //move
                        showMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if(board[k][j]==board[i][j] && noBlockVertical(j,i,k,board)  && !hasConflicted[k][j]){
                        //if( board[k][j]<=2*(board1[k][j])) {
                            //move
                            showMoveAnimation(i, j, k, j);
                            //add
                            board[k][j] += board[i][j];
                            board[i][j] = 0;
                            score+=board[k][j];
                            updateScore(score);
                        //}
                        hasConflicted[k][j]=true;
                        continue;
                    }
                }
            }
        }
    setTimeout('updateBoardView()',200);
    return true;
}

function moveUp(){
    if(!canMoveUp(board))
        return false;
    //let board1=board.slice();
    //let board1=newCopy(board);

    //moveUp,默认j代表列，i代表行
    for(let j=0;j<4;j++)
        for(let i=1; i<4; i++){
            if(board[i][j]!=0){
                for(let k=0;k<i;k++){
                    if(board[k][j]==0 && noBlockVertical(j,k,i,board)){
                        //move
                        showMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if(board[k][j]==board[i][j] && noBlockVertical(j,k,i,board) && !hasConflicted[k][j]){
                        //if(board[k][j]<=2*(board1[k][j])) {
                            //move
                            showMoveAnimation(i, j, k, j);
                            //add
                            board[k][j] += board[i][j];
                            board[i][j] = 0;
                            score+=board[k][j];
                            updateScore(score);
                        //}
                        hasConflicted[k][j]=true;
                        continue;
                    }
                }
            }
        }
    setTimeout('updateBoardView()',200);
    return true;
}

// function newCopy(arr){
// 				// 在函数内使用var声明一个拷贝数组用于拷贝
// 				let copyArr = new Array;
// 				for (let i = 0; i < arr.length; i++) {
// 					// 判断第i位是否为数组(二维)
// 					if (typeof arr[i] == "object") {
// 						// 若第i位是数组我们就将copyArr的第i位也置为数组（这里使用
// 						//var声明会出错，因为copyArr[i]并不是一个变量）并用for循环赋值
// 						copyArr[i] = new Array();
// 						for (let j = 0; j < arr[i].length; j++) {
// 							copyArr[i][j] = arr[i][j];
// 						}
// 						// 如果不是数组则直接赋值
// 					} else {
// 						copyArr[i] = arr[i];
// 					}
// 				}
// 				// 返回我们的拷贝数组
// 				return copyArr;
// 			}