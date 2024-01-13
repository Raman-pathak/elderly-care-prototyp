const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();
const port = 8000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Dummy data for demonstration (replace with a database in a real application)
let users = [];

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/register', (req, res) => {
  const { username, age } = req.body;
  users.push({ id: users.length + 1, username, age, medications: [], vitalSigns: {} });
  res.redirect(`/dashboard/${users.length}`);
});

app.get('/dashboard/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const user = users.find(u => u.id === userId);

  if (user) {
    res.render('dashboard', { user });
  } else {
    res.redirect('/');
  }
});

app.post('/add-medication', (req, res) => {
  const { userId, medication } = req.body;
  const user = users.find(u => u.id === parseInt(userId));

  if (user) {
    user.medications.push(medication);
    res.redirect(`/dashboard/${userId}`);
  } else {
    res.redirect('/');
  }
});

app.post('/update-vitals', (req, res) => {
  const { userId, heartRate, bloodPressure, temperature } = req.body;
  const user = users.find(u => u.id === parseInt(userId));

  if (user) {
    user.vitalSigns = { heartRate, bloodPressure, temperature };
    res.redirect(`/dashboard/${userId}`);
  } else {
    res.redirect('/');
  }
});

// Function to convert time to string value
const getTimeString = ({ hours, minutes, seconds, zone }) => {
  if (minutes / 10 < 1) {
    minutes = "0" + minutes;
  }
  if (seconds / 10 < 1) {
    seconds = "0" + seconds;
  }
  return `${hours}:${minutes}:${seconds} ${zone}`;
};



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});