'use strict'
const fs = require('fs')
const currentUser = 'You'
const fileName = process.argv[2]
const flags = process.argv.slice(2)
const omitMedia = flags.indexOf('-o') >= 0
const noType = flags.indexOf('-t') >= 0

const lineDateEnd = 22
const lineTextStart = 23

const omitMediaRegEx = /(image|audio|video) omitted$/

let txtData, systemMessage

if (fileName) {
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
      throw err
    }

    txtData = data

    init()
  })
}

function trimLine(line) {
  line = line.trim()
  // remove left to right unicode char
  if (line.charCodeAt(0) === 8206) return line.slice(1)
  return line
}

function getDate(dateStr) {
  if (dateStr[0] !== '[') {
    return null
  }

  const year = dateStr.slice(7, 11)
  const month = parseInt(dateStr.slice(4,6)) - 1
  const date = dateStr.slice(1, 3)
  const hour = dateStr.slice(13, 15)
  const min = dateStr.slice(16, 18)
  const sec = dateStr.slice(19,21)

  return new Date(year, month, date, hour, min, sec)
}

function getUser(userStr) {
  let endIndex = userStr.indexOf(':')
  
  if (endIndex >= 0) {
    return userStr.slice(0, endIndex)
  } else {
    endIndex = userStr.search(/\s(left|changed|was|were)/)
    if (endIndex >= 0) {
      systemMessage = true
      const user = userStr.slice(0, endIndex)
      return user === 'You' ? currentUser : user
    }
  }

  // no user found
  return null
}

function getMessage(messageStr, user) {
  if (user) {
    messageStr = messageStr.slice(user.length + 2)
  }

  return messageStr
}

function init() {
  const txtDataArr = txtData.split('\n')
  const jsonData = { data: [] }

  for (let i = 0, len = txtDataArr.length; i < len; i ++) {

    const line = trimLine(txtDataArr[i])

    if (!line.length || (omitMedia && omitMediaRegEx.test(line))) {
      continue
    }

    const obj = {}
    systemMessage = false

    obj.date = getDate(line.slice(0, lineDateEnd))

    if (!obj.date) {
      jsonData.data[jsonData.data.length - 2].message += `\n${line}`
    } else {
      const message = line.slice(lineTextStart)
      obj.user = getUser(message)
      obj.message = systemMessage ? message : getMessage(message, obj.user)
      if (!noType) {
        obj.type = systemMessage ? 'action' : 'message'
      }

      jsonData.data.push(obj)
    }
  }

  const jsonUrl = `${fileName.slice(0, -4)}.json`

  saveFile(jsonUrl, JSON.stringify(jsonData))
}

function saveFile(jsonUrl, jsonStr) {
  fs.writeFile(jsonUrl, jsonStr, (err) => {
    if (err) {
      throw err
    }
    console.log(`Written to ${jsonUrl}`)
  })
}