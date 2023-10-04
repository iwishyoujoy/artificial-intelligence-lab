const express = require('express');
const childProcess = require('child_process');
const cors = require('cors');
const app = express();

const cards = ['card(2, clubs)',
    'card(3, clubs)',
    'card(4, clubs)',
    'card(5, clubs)',
    'card(6, clubs)',
    'card(7, clubs)',
    'card(8, clubs)',
    'card(9, clubs)',
    'card(10, clubs)',
    'card(jack, clubs)',
    'card(queen, clubs)',
    'card(king, clubs)',
    'card(ace, clubs)',
    'card(2, diamonds)',
    'card(3, diamonds)',
    'card(4, diamonds)',
    'card(5, diamonds)',
    'card(6, diamonds)',
    'card(7, diamonds)',
    'card(8, diamonds)',
    'card(9, diamonds)',
    'card(10, diamonds)',
    'card(jack, diamonds)',
    'card(queen, diamonds)',
    'card(king, diamonds)',
    'card(ace, diamonds)',
    'card(ace, diamonds)',
    'card(2, hearts)',
    'card(3, hearts)',
    'card(4, hearts)',
    'card(5, hearts)',
    'card(6, hearts)',
    'card(7, hearts)',
    'card(8, hearts)',
    'card(9, hearts)',
    'card(10, hearts)',
    'card(jack, hearts)',
    'card(queen, hearts)',
    'card(king, hearts)',
    'card(ace, hearts)',
    'card(2, spades)',
    'card(3, spades)',
    'card(4, spades)',
    'card(5, spades)',
    'card(6, spades)',
    'card(7, spades)',
    'card(8, spades)',
    'card(9, spades)',
    'card(10, spades)',
    'card(jack, spades)',
    'card(queen, spades)',
    'card(king, spades)',
    'card(ace, spades)'];

function shuffleCards(array){
    let currentIndex = array.length,  randomIndex;
    while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

app.use(cors());
app.get('/ask-prolog', (req, res) => {
    const card1Value = req.query.card1;
    const card1Suit = req.query.suit1;
    const card2Value = req.query.card2;
    const card2Suit = req.query.suit2;

    let result = '';
    let remainingCards = cards.filter((card) => (card !== `card(${card1Value}, ${card1Suit})`) && (card !== `card(${card2Value}, ${card2Suit})`))

    console.log(`Got 1-st card: ${card1Value} ${card1Suit}`);
    console.log(`Got 2-nd card: ${card2Value} ${card2Suit}`);
    console.log(`Remaining cards: ${remainingCards}`);

    let prolog = childProcess.spawn('swipl', ['-q', '-l', 'programLab3.pl']);

    let shuffledCards = shuffleCards(remainingCards);
    let tableCards = `[${shuffledCards[10]}, ${shuffledCards[11]}, ${shuffledCards[12]}, ${shuffledCards[13]}, ${shuffledCards[14]}]`;
    let queue = [`hand(me, [card(${card1Value}, ${card1Suit}), card(${card2Value}, ${card2Suit})])`,
    `hand(lesha, [${shuffledCards[0]}, ${shuffledCards[1]}])`, 
    `hand(dima, [${shuffledCards[2]}, ${shuffledCards[3]}])`,
    `hand(anya, [${shuffledCards[4]}, ${shuffledCards[5]}])`,
    `hand(misha, [${shuffledCards[6]}, ${shuffledCards[7]}])`,
    `hand(sasha, [${shuffledCards[8]}, ${shuffledCards[9]}])`,
    `table(${tableCards})`]

    let combinationsNames = ['Pair', 'Two Pair', 'Set', 'Straight', 'Flush', 'Full House', 'Four Of A Kind', 'Straight Flush', 'Royal Flush'];
    let tableCombinationsQueue = [`pair(${tableCards})`, `twoPair(${tableCards})`, `set(${tableCards})`, `straight(${tableCards})`, `flush(${tableCards})`, `fullHouse(${tableCards})`, `fourOfAKind(${tableCards})`, `straightFlush(${tableCards})`, `royalFlush(${tableCards})`];
    let counter = 0;

    result += queue.join(';');
    result = result + ";<br><br> Any combinations on a table? <br><br>;"
    // добавляем полученную "руку" пользователя
    prolog.stdin.write('assert(' + queue.shift() + ').\n');

    prolog.stdout.on('data', (data) => {
        console.log('stdout: ' + data);
        if (!queue.length){
            if (counter >= tableCombinationsQueue.length){
                result += `<strong>${combinationsNames[counter-1]}</strong>: ${data}<br>;`;
                res.send(result);
                prolog.kill();
            }
            else{
                prolog.stdin.write(tableCombinationsQueue[counter]+ '.\n');
                if (counter !== 0){
                    result += `<strong>${combinationsNames[counter-1]}</strong>: ${data}<br>;`;
                }
                counter++;
            }
        }
        else{
            prolog.stdin.write('assert(' + queue.shift() + ').\n');
        }
    });

    prolog.stderr.on('data', (data) => {
        console.log('stderr: ' + data);
        prolog = childProcess.spawn('swipl', ['-q', '-l', 'programLab3.pl']);
    });

    prolog.on('exit', (code) => {
        console.log(`Child process exited with code ${code}`);
    });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});