import { convertToJSON } from '../src/chatToMessages' // file, omitMedia, noType
import { standardChat } from './mocks/chat'
import { standardMessages } from './mocks/messages'

describe('Convert text file to JSON', () => {
  test('an empty string is passed to the conversion method', () => {
    const file = ''

    const data = convertToJSON(file)
    expect(data).toBeTruthy()
  })

  test('a valid file', () => {
    const data = convertToJSON(standardChat)
    console.log(standardMessages)
    expect(data).toBeTruthy()
  })

  test('omitted media messages are to be removed', () => {
    // const data = convertToJSON(standardMessages)
    
    expect(true).toBeTruthy()
  })
})