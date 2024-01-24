// צור מספר אקראי בין 1 ל10
let win = 0;
let numOfTry = 0;
let maxTrys = 3;
let randomNumber = Math.floor(Math.random() * 10) + 1;
console.log(randomNumber);
let highScores = 0;

// שליחת הנתונים לשרת 
const sendScores = () => {
    const scores = document.getElementById("wins");
    let currentWins = parseInt(scores.innerText);
    console.log(currentWins);
    console.log(scores);
    fetch('http://localhost:5000/scores', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentWins })
    })

}

const finishGame = () => {
    sendScores();
}

// פונקציה שמחזירה לי את המערך הנקודות של המשתמש
function showScores() {

   const AllScorses = document.getElementById('myScore')
    // לקיחת הנתונים מהשרת
    fetch('http://localhost:5000/getPoints', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(res => res.json()) 
        .then(data => {
            console.log(data.YourScoresIs); 
            for (let i = 0; i < data.YourScoresIs.length; i++) {
                AllScorses.innerHTML += data.YourScoresIs[i] + ' , ';
            }
           
        })
        AllScorses.innerHTML=' ';
};

// פונקציה שבודקת רת הניחוש של המשתמש
function checkGuess() {
    // מקבל את הניחוש של המשתמש משדה הקלט
    const userGuess = document.getElementById('userGuess').value;
    //ממיר את ניחוש המשתמש למספר
    const userGuessNumber = parseInt(userGuess);
    //בודק נאם הניחוש אכן נכון
    if (userGuessNumber === randomNumber) {
        document.getElementById('resultMessage').innerText = 'Congratulations! You guessed the correct number!';
        win++;
        console.log("win = ", win);
        randomNumber = Math.floor(Math.random() * 10) + 1;
        console.log(randomNumber);
        document.getElementById('userGuess').value = "";
        numOfTry = 0;
    } else {
        numOfTry++;
        if (numOfTry === maxTrys) {
            document.getElementById('resultMessage').innerText = 'Sorry, you have reached the maximum number of attempts. Try again!';
            numOfTry = 0; // אם הגיע למספר המקסימלי של נסיונות, אפס את מספר הנסיונות
            randomNumber = Math.floor(Math.random() * 10) + 1;
            console.log(randomNumber);
        } else {
            document.getElementById('resultMessage').innerText = 'Sorry, that\'s not the correct number. Try again!';
        }
        document.getElementById('userGuess').value = "";

    }
    document.getElementById('userGuess').value = "";
    document.getElementById('tries').innerText = `${numOfTry}`;
    document.getElementById('wins').innerText = `${win}`;
}
