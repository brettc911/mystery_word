const express = require('express')
const exphbs = require('express-handlebars')
const expressValidator = require('express-validator')
const session = require('express-session')
const bodyParser = require('body-parser')
const wordsArray = require('./modules/words.js')
const word = require('./modules/word.js')
const app = express()

// Route names
const homeRoute = require('./routes/home');

// Configure view
app.engine('handlebars', exphbs())
app.set('views', './views')
app.set('view engine', 'handlebars')
// Configure statc files/ directory
app.use(express.static('public'))
// Configure parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
// Validate information
app.use(expressValidator())

// Session Middleware
app.use(session({
  secret: 'farts',
  resave: false,
  saveUninitialized: true
}))

// Sessions
app.use((req, res, next) => {
  if (!req.session.word) {
    req.session.word = [wordsArray[Math.floor(Math.random() * wordsArray.length)]]
    req.session.updatedArray = undefined
    req.session.wrongArray = []
    req.session.guesses = 8

  }
  next()
})

// Home route
// app.use('/', homeRoute)
app.get('/', (req, res) => {
  const mysteryWord = (req.session.word[0].toUpperCase())
  console.log(mysteryWord)
  res.render('home', {
    word: word.generateBlanks(mysteryWord),
    guesses: req.session.guesses
  })
})




app.post('/submit', (req, res) => {
  // Make input letter uppercase
  req.body.inputLetter = req.body.inputLetter.toUpperCase()
  // Validation check on input letter
  req.checkBody('inputLetter', 'Only one letter allowed').isByteLength({
    min: 0,
    max: 1
  })
  req.checkBody('inputLetter', 'Must enter a letter').notEmpty()
  req.checkBody('inputLetter', 'Entry must be a letter').isAlpha()
  req.getValidationResult().then(function(result) {
    var errors = result.array()

    if (errors.length > 0) {
      console.log(newArray)
      const mysteryWord = (req.session.word[0].toUpperCase())
      var blanks = word.generateBlanks(mysteryWord)
      var newArray
      req.session.updatedArray === undefined ? newArray = word.checkLetter(inputLetter, mysteryWord, blanks) : newArray = word.checkLetter(inputLetter, mysteryWord, req.session.updatedArray)
      req.session.updatedArray = newArray


      res.render('home', {
        errors: errors,
        word: req.session.updatedArray,
        guesses: req.session.guesses,
        wrong: req.session.wrongArray
      })
    } else {
      const mysteryWord = (req.session.word[0].toUpperCase())
      var inputLetter = req.body.inputLetter
      var blanks = word.generateBlanks(mysteryWord)
      var newArr
      if (!word.letterPresent(inputLetter, mysteryWord)) {
        req.session.guesses --
        req.session.wrongArray.push(inputLetter)
      }
      req.session.updatedArray === undefined ? newArr = word.checkLetter(inputLetter, mysteryWord, blanks) : newArr = word.checkLetter(inputLetter, mysteryWord, req.session.updatedArray)
      req.session.updatedArray = newArr




      res.render('home', {
        word: req.session.updatedArray,
        guesses: req.session.guesses,
        wrong: req.session.wrongArray
      })

    }
  });




})

// Port config
app.listen(3000, function() {
  console.log("listening on port 3000...")
})
