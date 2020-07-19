import { convertToJSON } from '../chatToMessages'
import { info } from '../utils/info'
import { writeFile, readFileSync } from 'fs'

const fileName = process.argv[2]
const flags = process.argv.slice(2)
const includeMediaLines = flags.includes('-m')
const includeType = flags.includes('-t')

// default: hide the omitted media lines
// default: don't show the type

if (!fileName) {
  throw Error('No filename provided.')
}

let json
let jsonUrl = `${fileName.slice(0, -4)}-messages.json`

try {
  const file = readFileSync(fileName, 'utf8')
  json = convertToJSON(file, includeMediaLines, includeType)
} catch (err) {
  throw Error('Error loading file. Make sure the filename is correct and target file exists.')
}

if (!json) {
  throw Error('No data returned.')
}

writeFile(jsonUrl, JSON.stringify(json), (err) => {
  if (err) {
    throw err
  }
  
  info(`written to ${jsonUrl}`)
})
