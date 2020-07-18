import { info } from './utils/info'
const nonChars = /[\.,"!\?£\$%\^&\*\|\(\)~\=\+\[\]\/\\;:@#\{\}<>`0-9“”\-]/g
const spacesRe = /\s+/g

const filterWordsRe = /^(and|that|get|what|for|you|this|was|have|with|are|good|the|yeh|yeah|got|now|not|can|too|like|all|but)$/g
let removeApostropheWords

export const convertToWordCount = ({ data }, raw) => {

  removeApostropheWords = raw
  data = stripActions(data)

  info('formatting messages')
  const formattedMessages = formatMessages(data)

  info('collating and filtering words')
  const filteredWords = collateFilterWords(formattedMessages)

  info('creating unique words object')
  const uniqueWords = createUniqueWords(filteredWords)

  return { data: uniqueWords }
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
    } else {
      obj[item] += 1
    }

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

function filterWords(word) {
  if (word.length > 2
    && word.length < 20
    && !filterWordsRe.test(word)
    && (!removeApostropheWords || (removeApostropheWords && word.indexOf("'") < 0))
  ) {
    return true
  }

  return false
}

function stripActions(data) {
  return data.filter(i => i.type !== 'action')
}