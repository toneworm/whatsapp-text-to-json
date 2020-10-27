import { convertToWordCount } from '../messagesToWordCount'
import { standardMessages } from '../__mocks__/messages'

describe('Convert messages JSON file to word count file', () => {
  const { data } = convertToWordCount(standardMessages)

  test('Word count array is populated by the correct number of unique words', () => {
    expect(Object.keys(data)).toHaveLength(159)
  })

  test('Word count array does not contain any unique words shorter than 3 letters', () => {
    const shortWords = Object.keys(data).filter(word => word.length < 3)

    expect(shortWords).toHaveLength(0)
  })

  test('Word with most uses should be "there"', () => {
    const mostUses = Object.values(data).reduce((prev, next) => Math.max(prev, next))
    const [ longWord ] = Object.entries(data).filter(([, freq]) => freq === mostUses)

    expect(longWord).toMatchObject(['there', 5])
  })

  test('Number of unique words used once', () => {
    const leastUses = Object.values(data).reduce((prev, next) => Math.min(prev, next))
    const shortWords = Object.entries(data).filter(([, freq]) => freq === leastUses)

    expect(shortWords).toHaveLength(116)
  })
})