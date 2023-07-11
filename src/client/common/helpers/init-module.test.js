import { initModule } from '~/src/client/common/helpers/init-module'

describe('#initModule', () => {
  const mockModule = jest.fn()

  describe('With elements', () => {
    beforeEach(() => {
      document.getElementsByTagName('html')[0].innerHTML = `
        <div data-js="mock-javascript-functionality">Mock one</div>
        <div data-js="mock-javascript-functionality">Mock two</div>
        <div data-js="mock-javascript-functionality">Mock three</div>
      `
    })

    test('Should call module with element', () => {
      const mockElements = Array.from(
        document.querySelectorAll(`[data-js="mock-javascript-functionality"]`)
      )

      initModule('mock-javascript-functionality', mockModule)

      expect(mockModule).toHaveBeenNthCalledWith(1, mockElements.at(0))
      expect(mockModule).toHaveBeenNthCalledWith(2, mockElements.at(1))
      expect(mockModule).toHaveBeenNthCalledWith(3, mockElements.at(2))

      expect(mockModule).toHaveBeenCalledTimes(3)
    })
  })

  describe('With no elements', () => {
    test('Should not call module', () => {
      initModule([], mockModule)
      expect(mockModule).not.toHaveBeenCalled()
    })
  })
})
