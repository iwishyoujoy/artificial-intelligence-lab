function playGame(){
    let card1Value = document.getElementById("input1").value;
    let card2Value = document.getElementById("input2").value;
    let card1Suit = document.getElementById("select1").value;
    let card2Suit = document.getElementById("select2").value;
    
    askProlog(card1Value, card1Suit, card2Value, card2Suit);
}

function parseHands(newData){
    let result = [];
    newData.forEach((hand) => {
        if (hand.substring(0, 5) === 'table'){
            let newHand = hand.substring(7, hand.length - 2);
            let newHandArray = newHand.split("card(");
            newHandArray.shift();
            let cardsOnTable = '';
            newHandArray.forEach((card) => {
                let value = card.substring(0, card.indexOf(","));
                let suit = card.substring(card.indexOf(",") + 1, card.indexOf(")"));
                cardsOnTable += value + " " + suit + ", ";
            })
            cardsOnTable = cardsOnTable.substring(0, cardsOnTable.length - 2);
            result.push(`<strong>table</strong>: ${cardsOnTable}`);
        }
        else{
            let newHand = hand.substring(5, hand.length - 1);
            let name = newHand.substring(0, newHand.indexOf(','));
            newHand = newHand.substring(newHand.indexOf(',') + 3, newHand.length - 1);
            let newHandArray = newHand.split("(");
            let card1Value = newHandArray[1].substring(0, newHandArray[1].indexOf(","));
            let card1Suit = newHandArray[1].substring(newHandArray[1].indexOf(",") + 2, newHandArray[1].indexOf(")"));
            let card2Value = newHandArray[2].substring(0, newHandArray[2].indexOf(","));
            let card2Suit = newHandArray[2].substring(newHandArray[2].indexOf(",") + 2, newHandArray[2].indexOf(")"));
            result.push(`<strong>${name}</strong>: ${card1Value} ${card1Suit}, ${card2Value} ${card2Suit} <br>`)
        }
    });
    return result;
}

function askProlog(card1Value, card1Suit, card2Value, card2Suit) {  
    fetch(`http://localhost:3000/ask-prolog?card1=${encodeURIComponent(card1Value)}&suit1=${encodeURIComponent(card1Suit)}&card2=${encodeURIComponent(card2Value)}&suit2=${encodeURIComponent(card2Suit)}`)
      .then(response => response.text())
      .then(data => {
        console.log(data);
        let newData = data.split(";");
        let parsedData = parseHands(newData.slice(0, 7));
        let otherData = newData.slice(7, newData.length);
        let completedData = parsedData.concat(otherData);
        document.getElementById('console').innerHTML = completedData.join("");
      })
      .catch((error) => {
        console.error('Error:', error);
      });
}