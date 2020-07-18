import { convertToJSON } from '../chatToMessages'
import { info } from '../utils/info'
import { writeFile, readFileSync } from 'fs'

const fileName = process.argv[2]
const flags = process.argv.slice(2)
const omitMedia = !flags.includes('-m')
const noType = flags.includes('-nt')

if (!fileName) {
  throw Error('No filename provided.')
}

let json
let jsonUrl = `${fileName.slice(0, -4)}-messages.json`

try {
  const file = readFileSync(fileName, 'utf8')
  json = convertToJSON(file, omitMedia, noType)
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
  
  info(`Written to ${jsonUrl}`)
})
