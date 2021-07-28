const CURRENT_USER = 'You'
const LINE_DATE_END = 22
const LINE_TEXT_START = 23

const mediaLineRegEx = /(image|audio|video|GIF) omitted$/

export function convertToJSON(chatTextString, includeMediaLines, includeType) {
  const chatTextArr = chatTextString.split('\n')
  const jsonData = []

  for (let i = 0, len = chatTextArr.length; i < len; i ++) {
    const line = cleanLine(chatTextArr[i])

    // skip line if empty, media omitted message + flag or e2e encryption message
    if (
      !line.length
      || (!includeMediaLines && mediaLineRegEx.test(line))
      || (i === 0 && line.indexOf('Messages to this group are now secured with end-to-end encryption.') >= 0)
    ) {
      continue
    }

    const date = getDate(line.slice(0, LINE_DATE_END))

    // if no date, treat as additional line
    if (!date) {
      jsonData[jsonData.length - 1].message += `\n${line}`
    } else {
      const { user, messageType, message } = getMessageDetails(line.slice(LINE_TEXT_START))

      jsonData.push({
        date,
        user,
        message,
        ...( includeType ? { type: messageType } : {})
      })
    }
  }

  return { data: jsonData }
}

function cleanLine(line) {
  // strip chars: 8206 (ltr), 8236
  const stripChars = [8206, 8236].map(code => String.fromCharCode(code))
  return line.replace(new RegExp(`(${stripChars.join('|')})`, 'g'), '').trim()
}

function getDate(dateStr) {
  if (dateStr[0] !== '[') {
    return null
  }

  const RE_DATE = /(?<year>\d{4})\/(?<month>\d{1,2})\/(?<date>\d{1,2}), (?<hour>\d{2}):(?<min>\d{2}):(?<sec>\d{2})/;
  const { groups: { year, month, date, hour, min, sec } } = RE_DATE.exec(dateStr);;

  return new Date(year, month - 1, date, hour, min, sec).toISOString()
}

function getMessageDetails(messageStr) {

  // encryption message
  if (/Messages to this group are now secured with end-to-end encryption./.test(messageStr)) {
    return {
      user: null,
      messageType: 'system',
      message: 'Messages to this group are now secured with end-to-end encryption.'
    }
  }

  // standard message
  let userEndIndex = messageStr.indexOf(':')
  
  if (userEndIndex >= 0) {
    const user = messageStr.slice(0, userEndIndex)
    return {
      user,
      message: getUserMessage(messageStr, user),
      messageType: 'message'
    }
  }

  // system message
  userEndIndex = messageStr.search(/\s(left)/)
  
  if (userEndIndex >= 0) {
    return {
      user: null,
      message: messageStr,
      messageType: 'system'
    }
  }

  // action message
  userEndIndex = messageStr.search(/created|added|changed|joined|left|removed|group/)

  if (userEndIndex >= 0) {
    const userStr = messageStr.slice(0, userEndIndex)
    // TODO: current user to be configurable
    return {
      user: userStr === 'You' ? CURRENT_USER : userStr,
      message: messageStr,
      messageType: 'action'
    }
  }

  // unhandled message type
  return {
    user: null,
    message: messageStr,
    messageType: null,
  }
}

function getUserMessage(messageStr, user = '') {
  return messageStr.slice(user.length + 2)
}