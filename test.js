let board = [];
for(let i=0;i<4;i++){
        board[i]=[];
        for(let j=0;j<4;j++){
            board[i][j]=0;
        }

    }

board2=newCopy(board)

    console.log(board);
    console.log(board2)
    console.log(board===board2)
    board2[0][0]=10;
    console.log(board);
    console.log(board2)

function newCopy(arr) {
				// 在函数内使用var声明一个拷贝数组用于拷贝
				let copyArr = new Array;
				for (let i = 0; i < arr.length; i++) {
					// 判断第i位是否为数组(二维)
					if (typeof arr[i] == "object") {
						// 若第i位是数组我们就将copyArr的第i位也置为数组（这里使用
						//var声明会出错，因为copyArr[i]并不是一个变量）并用for循环赋值
						copyArr[i] = new Array();
						for (let j = 0; j < arr[i].length; j++) {
							copyArr[i][j] = arr[i][j];
						}
						// 如果不是数组则直接赋值
					} else {
						copyArr[i] = arr[i];
					}
				}
				// 返回我们的拷贝数组
				return copyArr;
			}
