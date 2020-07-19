import { convertToJSON } from '../src/chatToMessages'
import { standardChat } from './mocks/chat'
import { standardMessages } from './mocks/messages'
// convertToJSON -> chatTextString, includeMediaLines, includeType

describe('Convert text file to JSON', () => {
  test('an empty string returns a valid JSON object', () => {
    const file = ''

    const res = convertToJSON(file)
    expect(res).toMatchObject({
      data: []
    })
  })

  test('a valid file string returns valid messages', () => {
    const { data } = convertToJSON(standardChat)

    expect(data).toEqual(
      expect.arrayContaining([
        {
          date: '2020-04-09T15:26:38.000Z',
          user: 'Bob',
          message: "Dave, do you have my sleeping bag?"
        }
      ])
    )
  })

  test('a valid file string returns valid multiline messages', () => {
    const { data } = convertToJSON(standardChat)

    expect(data).toEqual(
      expect.arrayContaining([
        {
          date: '2020-03-13T09:47:32.000Z',
          user: 'Bob',
          message: "Hello all. Have any of you made any plans for the wedding? Are you going? I am trying to work out the best way to get to and from there and what else I might do while I am there.\nAlso, fancy the pub on Saturday?"
        }
      ])
    )
  })

  test('media message lines to be included', () => {
    const { data } = convertToJSON(standardChat, true)

    const expecters = ['image', 'audio', 'video', 'GIF'].map(type => expect.objectContaining({
      message: expect.stringMatching(new RegExp(type + ' omitted'))
    }))

    // hidden char (8206) before omitted media lines
    expect(data).toEqual(
      expect.arrayContaining([
        ...expecters
      ])
    )
  })

  test('type of message to be included', () => {
    const { data } = convertToJSON(standardChat, false, true)

    const expecters = ['system', 'message', 'action'].map(type => expect.objectContaining({
      type
    }))

    expect(data).toEqual(
      expect.arrayContaining([
        ...expecters
      ])
    )
  })
})