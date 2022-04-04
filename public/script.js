//const RANDOM_QUOTE_API_URL = 'http://213.217.8.92:2222/text';
const RANDOM_QUOTE_API_URL = 'http://192.168.0.103:2222/text';
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');
const speedElement = document.getElementById('speed');
let quote=null;
let chars = 1;
let speedArray = [];
let errors = 0;
let started = false;

const displayChar = (el, char) => {
    let ch = char;
    switch (ch) {
        case '\n': ch = '<i>↲</i><br/>'; break;
        case '¬': ch = '<i>↲</i><br/>&nbsp;&nbsp;'; break;
        case ' ': ch = '<i>␣</i>'; break;
        case '(': ch = '<b>(</b>'; break;
        case ')': ch = '<b>)</b>'; break;
        case '{': ch = '<b>{</b>'; break;
        case '}': ch = '<b>}</b>'; break;
        case ';': ch = '<b>;</b>'; break;
        case '.': ch = '<b>.</b>'; break;
        case ',': ch = '<b>,</b>'; break;
        default:
            break;
    }
    el.innerHTML=ch;
};

const getRightQuoteArr = (arr) => {
    return arr.map(ch => {
        return ch === '¬' ? '\n' : ch;  //  \n\n to \n for inputRightQuote
    });
}

//========================================
let quoteArray = null;
let inputArray = null;
let rightQuoteArr = null;
let selEnd = 0;
const cursor = document.createElement('b');
cursor.id = 'cursor';
cursor.innerText = '|';

quoteInputElement.addEventListener('selectionchange', () => {
    selEnd = quoteInputElement.selectionEnd;
    if (quoteArray) {
        if (selEnd === 0) {
            //
        }
        quoteArray[selEnd-1] && quoteArray[selEnd-1].appendChild(cursor);
    }
});

quoteInputElement.addEventListener('input', (e) => {
    inputArray = quoteInputElement.value.split('');
    quoteArray = quoteDisplayElement.querySelectorAll('span');
    rightQuoteArr = getRightQuoteArr(quote.split(''));
    let correct = true;
    let typoFound = false;
    if (!started) {startTimer();}
    for (let i = quoteArray.length - 1; i >= 0; i--) {
        if (inputArray[i]==null) {  //  if input is empty
            displayChar(quoteArray[i], quote[i]);
            quoteArray[i].classList.remove('correct');
            quoteArray[i].classList.remove('incorrect');
            correct=false;
        }
        else if (rightQuoteArr[i]===inputArray[i]) {    //  if  characters equal
            displayChar(quoteArray[i],quote[i]);
            quoteArray[i].classList.add('correct');
            quoteArray[i].classList.remove('incorrect');
        }
        else {
            displayChar(quoteArray[i], inputArray[i]);
            if (quoteArray[i].classList[0]!=="incorrect" && !typoFound && e.data) { //  count only new errors / e.data!==null
                errors++;
                document.getElementById('errors').innerHTML = errors.toString();
                typoFound = true;   //  count only one typo for check
            }
            quoteArray[i].classList.add('incorrect');
            quoteArray[i].classList.remove('correct');
            correct=false;
        }
    }
    if (correct) {
        speedArray.push(chars / getTimerTime() * 60);
        let averageSpeed = countAverageSpeed();
        speedElement.innerText=averageSpeed.toFixed(2);
        renderNewQuote().then(() => console.log('new quote'));
    }
});
//========================================
function getRandomQuote() {
    return quote = fetch(RANDOM_QUOTE_API_URL, {
    	headers: {
      'Access-Control-Allow-Origin': '*',
    },
    })
        .then(response => response.json())
        .then(data => data.text);
}

//========================================

async function renderNewQuote() {
    stopTimer();
    quote = await getRandomQuote();
    let regexp = new RegExp('\n\n', 'g');
    quote = quote.replace(regexp, '¬');
    quoteDisplayElement.innerText = ''; //  empty
    chars = quote.length;
    quote.split('').forEach(character => {
        const characterSpan = document.createElement('span');
        displayChar(characterSpan, character);
        quoteDisplayElement.appendChild(characterSpan);
    });
    quoteInputElement.value = null;
    // startTimer();
}

//========================================

let countAverageSpeed = () => {
    let sum = 0;
    for (let i = 0; i < speedArray.length; i++) {
        sum+=speedArray[i];
    }
    return sum/speedArray.length;
}

//========================================

let startTime;
let interval = null;
function startTimer() {
    started=true;
    timerElement.innerText = '0';
    startTime = new Date();
    interval = setInterval(() => {
        timerElement.innerText = getTimerTime();
    }, 100)
}
function stopTimer() {
    started=false;
    timerElement.innerText = '0';
    interval && clearInterval(interval);
}

function getTimerTime() {
    let time = (Math.floor((new Date() - startTime) / 100) / 10).toString();
    if (time.split('.').length<2) time += '.0';
    return time;
}

renderNewQuote().then(() => console.log('new quote'));
