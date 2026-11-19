const fs = require('fs');
const path = require('path');

// Ship the dictionary with the app; minimal containers do not include one.
const words = fs.readFileSync(path.join(__dirname, '..', 'data', 'words.txt'), 'utf-8')
  .toLowerCase()
  .split(/\r?\n/)
  .map(word => word.trim())
  .filter(word => /^[a-z]+$/.test(word));

if (words.length === 0) throw new Error('The bundled word list contains no playable words');

module.exports = words;
