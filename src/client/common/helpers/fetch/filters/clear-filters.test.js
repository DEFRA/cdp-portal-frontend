import { clearFilters } from './clear-filters.js'

describe('#clearFilters', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: {
        ...window.location,
        search: '?page=2&size=20&filter=name',
        assign: vi.fn(),
        replace: vi.fn()
      }
    })
  })

  test('Should remove non-preserved keys from the query string', () => {
    const event = { preventDefault: vi.fn() }

    clearFilters(event)

    expect(window.location.search).toBe('page=1&size=50')
  })

  test('Should reset preserved keys to their default values', () => {
    const event = { preventDefault: vi.fn() }

    clearFilters(event)

    expect(window.location.search).toBe('page=1&size=50')
  })

  test('Should not modify the query string if it only contains preserved keys', () => {
    window.location.search = '?page=1&size=10'
    const event = { preventDefault: vi.fn() }

    clearFilters(event)

    expect(window.location.search).toBe('page=1&size=50')
  })

  test('Should do nothing if the query string is empty', () => {
    window.location.search = ''
    const event = { preventDefault: vi.fn() }

    clearFilters(event)

    expect(window.location.search).toBe('')
  })

  test('Should call preventDefault on the event', () => {
    const event = { preventDefault: vi.fn() }

    clearFilters(event)

    expect(event.preventDefault).toHaveBeenCalled()
  })
})
