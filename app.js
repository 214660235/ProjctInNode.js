//הקצאת מודלים
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const port = 5000;
let user; // שומר את המשתמש הנוכחי
let i = 0; // שמירת המיקום במערך כדי שלא תהיה דריסה

// מאפשר קריאת נתונים 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ניהול נתיבי האפליקציה
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/sign-in', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signin.html'));
});

// לוגיקת רישום המשתמש
app.post('/sign-in', (req, res) => {
    console.log(req.body);
    user = req.body;
    user.scores = [];
    console.log(user);
    const filePath = path.join(__dirname, 'DB', 'users.json');
    const users = JSON.parse(fs.readFileSync(filePath).toString());
    console.log(users);
    const findUser = users.find(u => user.email === u.email);
    console.log(findUser);

    //בדיקב אם המשתמש קיים, אם כן שילך לבצע הרשמה 
    if (findUser) {
        res.redirect('/login');
    } else {
        users.push(user);
        fs.writeFile(filePath, JSON.stringify(users), (err) => {
            if (err) {
                console.log('ERROR!!!', err);
                process.exit(1);
            }
        });
    //  אם לו שילך לדף המשחק
        res.sendFile(path.join(__dirname, 'public', 'game.html'));
    }
});

// ניהול הנתיב
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
// לגיקת ההתחברות של המשתמש
app.post('/log-in', (req, res) => {
    console.log(req.body);
    user = req.body;
    const filePath = path.join(__dirname, 'DB', 'users.json');
    const users = JSON.parse(fs.readFileSync(filePath).toString());
    const findUser = users.find(u => user.email === u.email);
    if (findUser) {
        res.sendFile(path.join(__dirname, 'public', 'game.html'));
    } else {
        // טוען את הדף של ההרשמה
        res.redirect('/sign-in');
    }
});

//הכנסת הנקודות למערך של המשתמש הנוכחי
app.post('/scores', (req, res) => {
    console.log(`the wins are ${req.body.currentWins}`)
    console.log(user);
    const filePath = path.join(__dirname, 'DB', 'users.json');
    const users = JSON.parse(fs.readFileSync(filePath).toString());
    const scores = parseInt(req.body.currentWins);    
    const findUser = users.find(u => u.email === user.email);
    if (findUser) {
        findUser.scores[i++] = scores;
        fs.writeFile(filePath, JSON.stringify(users), (err) => {
            if (err) {
                console.log('ERROR!!!', err);
                process.exit(1);
            }
            res.send('Scores updated successfully');
        });
    } else {
        res.status(404).send('User not found');
    }
});

//לקיחת הנתונים של הנקודות
app.get('/getPoints', (req, res) => {
    const filePath = path.join(__dirname, 'DB', 'users.json');
    const users = JSON.parse(fs.readFileSync(filePath).toString());
    const findUser = users.find(u => u.email === user.email);
   // אם אכן מצאת את המשתמש בקובץ JSON
    if (findUser) {
        console.log(findUser.scores);
        res.json({
            YourScoresIs: findUser.scores
       })
    // אם לא קיים כזה משתמש תחזיר שגיאה
    } else {
        return res.status(404).json({ message: 'User not found' });
    }
});



// האזנה לפורט 5000
app.listen(port, () => {
    console.log('app is listening on port 5000... ');
    console.log('http://localhost:5000/');
});
