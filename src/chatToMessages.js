const CURRENT_USER = 'You'
const LINE_DATE_END = 22
const LINE_TEXT_START = 23

const omitMediaRegEx = /(image|audio|video) omitted$/
let systemMessage

export function convertToJSON(chatTextString, omitMedia, noType) {
  const chatTextArr = chatTextString.split('\n')
  const jsonData = []

  for (let i = 0, len = chatTextArr.length; i < len; i ++) {
    const line = trimLine(chatTextArr[i])

    if (!line.length || (omitMedia && omitMediaRegEx.test(line))) {
      continue
    }

    systemMessage = false

    const date = getDate(line.slice(0, LINE_DATE_END))

    // if no date, treat as additional line
    if (!date) {
      jsonData[jsonData.length - 2].message += `\n${line}`
    } else {
      const allMessage = line.slice(LINE_TEXT_START)
      const user = getUser(allMessage)
      const message = systemMessage ? allMessage : getMessage(allMessage, user)

      jsonData.push({
        date,
        user,
        message,
        ...( !noType ? { type: systemMessage ? 'action' : 'message' } : {})
      })
    }
  }

  return { data: jsonData }
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
      return user === 'You' ? CURRENT_USER : user
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