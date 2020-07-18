import { convertToWordCount } from '../messagesToWordCount'
import { info } from '../utils/info'
import { writeFile, readFileSync } from 'fs'
const fileName = process.argv[2]
const flags = process.argv.slice(2)
const removeApostropheWords = flags.includes('-a')

if (!fileName) {
  throw Error('No filename provided.')
}

let json
const jsonUrl = `${fileName.slice(0, -14)}-words.json`

try {
  json = convertToWordCount(JSON.parse(readFileSync(fileName, 'utf8')), removeApostropheWords)
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

  info(`written to ${jsonUrl}`, true)
})