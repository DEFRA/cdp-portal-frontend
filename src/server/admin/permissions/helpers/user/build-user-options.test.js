import { buildUsersOptions } from './build-user-options.js'

const mockSearchCdpUsers = vi.fn()

vi.mock('../fetchers.js', () => ({
  searchCdpUsers: vi.fn(() => mockSearchCdpUsers())
}))

describe('#buildUsersOptions', () => {
  test('Should return null when no search query and no selected user are provided', async () => {
    const result = await buildUsersOptions(null, { kind: [] }, null)
    expect(result).toBeNull()
  })

  test('Should return options for users matching the search query', async () => {
    mockSearchCdpUsers.mockResolvedValue([{ name: 'John Doe', userId: '123' }])

    const result = await buildUsersOptions('John', { kind: ['member'] }, null)
    expect(result).toEqual([{ text: 'John Doe', value: '123' }])
  })

  test('Should return options including the selected user', async () => {
    const selectedUser = { name: 'Jane Doe', userId: '456' }
    const result = await buildUsersOptions(null, { kind: [] }, selectedUser)

    expect(result).toEqual([{ text: 'Jane Doe', value: '456' }])
  })

  test('Should return unique options when duplicate users are found', async () => {
    mockSearchCdpUsers.mockResolvedValue([
      { name: 'John Doe', userId: '123' },
      { name: 'John Doe', userId: '123' }
    ])

    const result = await buildUsersOptions('John', { kind: ['member'] }, null)
    expect(result).toEqual([{ text: 'John Doe', value: '123' }])
  })

  test('Should return null when no users match the search query', async () => {
    mockSearchCdpUsers.mockResolvedValue({ users: [] })

    const result = await buildUsersOptions(
      'Nonexistent',
      { kind: ['member'] },
      null
    )
    expect(result).toBeNull()
  })

  test('Should sort users alphabetically by name', async () => {
    mockSearchCdpUsers.mockResolvedValue([
      { name: 'Zara', userId: '789' },
      { name: 'Alice', userId: '123' }
    ])

    const result = await buildUsersOptions('a', { kind: ['member'] }, null)
    expect(result).toEqual([
      { text: 'Alice', value: '123' },
      { text: 'Zara', value: '789' }
    ])
  })
})
