word = {

  // Returns an array like [_,_,_,_,_] = to length of mystery word
  generateBlanks: function(word) {
    let wordArray = word.split('')
    let blankArray = []
    wordArray.forEach((e)=>{
      blankArray.push('_')
    })
    return blankArray
  },
  // Returns a new array replacing a blank with a letter, i.e. [_,_,A,_,_]
  checkLetter: function(letter, word, array) {
    let answerArray = word.split('')
    for (var i = 0; i < answerArray.length; i++) {
      if (answerArray[i] === letter) {
        array[i] = letter
      }
    }
      return array
  },
  // Returns a true or false value
  letterPresent: function(letter, word) {
    var there = false
    let answerArray = word.split('')
    for (var i = 0; i < answerArray.length; i++) {
      if (answerArray[i] === letter) {
        there = true
      }
    }
    return there
  }
}

module.exports = word
