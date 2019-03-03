'use strict'
const fs = require('fs')
const file = process.argv[2]
const flags = process.argv.slice(2)
const nonChars = /[\.,"!\?£\$%\^&\*\|\(\)~\=\+\[\]\/\\;:@#\{\}<>`0-9“”\-]/g
const spacesRe = /\s+/g
const removeApostropheWords = flags.indexOf('-a') >= 0

// const filterWordsRe = /^(and|that|get|what|for|you|this|was|have|with|are|good|the|yeh|yeah|got|now|not|can|too|like|all|but)$/g
const filterWordsObj = { and: 1, that: 1, get: 1, what: 1, for: 1, you: 1, this: 1, was: 1, have: 1, with: 1, are: 1, good: 1, the: 1, yeh: 1, yeah: 1, got: 1, now: 1, not: 1, can: 1, too: 1, like: 1, all: 1, but: 1 }

let data
const words = []

if (file) {
  fs.readFile(file, 'utf8', (err, res) => {
    if (err) {
      throw err
    }

    data = JSON.parse(res).data

    init()
  })
}

function init() {

  data = stripActions(data)

  info('formatting messages')
  const formattedMessages = formatMessages(data)

  info('collating and filtering words')
  const filteredWords = collateFilterWords(formattedMessages)

  info('creating unique words object')
  const uniqueWords = createUniqueWords(filteredWords)

  const jsonUrl = `${file.slice(0, -5)}_words.json`

  saveFile(jsonUrl, JSON.stringify({ data: uniqueWords }))
}

function formatString(str) {
  const formattedStr = str.replace(nonChars, ' ')
    .replace(spacesRe, ' ')
    .toLowerCase()

  return formattedStr
}

function formatMessages(data) {
  const wordsTxt = data.reduce(
    (arr, item) => arr.concat(formatString(item.message)),
    []
  )

  return wordsTxt
}

function createUniqueWords(words) {
  const uniqueWords = words.reduce((obj, item) => {
    if (item[0] === '\'') {
      item = item.slice(1)
    } else if (item[item.length - 1] === '\'') {
      item = item.slice(0, -1)
    }

    if (!obj[item]) {
      obj[item] = 1
    }

    obj[item] += 1

    return obj
  }, {})

  return uniqueWords
}

function collateFilterWords(messages) {
  const words = messages.reduce(
    (arr, message) => 
      arr.concat(
        message.split(' ')
          .filter(filterWords)
      ),
    []
  )

  return words
}

function saveFile(jsonUrl, jsonStr) {
  fs.writeFile(jsonUrl, jsonStr, (err) => {
    if (err) {
      throw err
    }

    info(`written to ${jsonUrl}`, true)
  })
}

function filterWords(word) {
  if (word.length > 2
    && word.length < 20
    && !filterWordsObj[word]
    && (!removeApostropheWords || (removeApostropheWords && word.indexOf("'") < 0))
  ) {
    return true
  }

  return false
}

function stripActions(data) {
  return data.filter(i => i.type !== 'action')
}

function info(message, noEllipsis) {
  console.log(`${message}${noEllipsis ? '' : '...'}`)
}