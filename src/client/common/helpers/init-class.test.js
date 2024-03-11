import { initClass } from '~/src/client/common/helpers/init-class'

describe('#initClass', () => {
  const mockKlass = jest.fn()

  describe('With elements', () => {
    beforeEach(() => {
      document.getElementsByTagName('html')[0].innerHTML = `
        <div data-js="mock-another-javascript-functionality">Mock one</div>
        <div data-js="mock-javascript-functionality">Mock two</div>
        <div data-js="mock-other-javascript-functionality">Mock three</div>
      `
    })

    test('Should call Klass with element', () => {
      const mockElements = Array.from(
        document.querySelectorAll(`[data-js="mock-javascript-functionality"]`)
      )

      initClass('mock-javascript-functionality', mockKlass)

      expect(mockKlass).toHaveBeenCalledWith(mockElements.at(0))
      expect(mockKlass).toHaveBeenCalledTimes(1)
    })
  })

  describe('With no elements', () => {
    test('Should not call module', () => {
      initClass([], mockKlass)
      expect(mockKlass).not.toHaveBeenCalled()
    })
  })
})
