/**
Validation for words.json
*/
const words = require('./commonWords.json')

console.log("number of one-letter entries:", words.filter(word => word.length === 1).length)
console.log("one-letter entries:", words.filter(word => word.length === 1))
console.log("all words lowercase:", words.every(word => word === word.toLowerCase()))
console.log("no empty entries:", words.every(word => word.length > 0))
console.log("length of array:", words.length)
