function showNumber(i,j,randNumber){
    let numberCell=$('#number-cell-'+i+'-'+j);
    numberCell.css('background-color',getBC(randNumber));
    numberCell.css('color',getC(randNumber));
    numberCell.text(randNumber);

    numberCell.animate({
        width:cellSideLength,
        height:cellSideLength,
        top:getPosTop(i,j),
        left:getPosLeft(i,j)
    },50);
}
