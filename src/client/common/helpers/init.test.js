import { initClass, initModule, initModules } from './init.js'

describe('#init', () => {
  describe('#initClass', () => {
    const mockClass = vi.fn()

    describe('With elements', () => {
      beforeEach(() => {
        document.getElementsByTagName('html')[0].innerHTML = `
        <div data-js="mock-another-javascript-functionality">Mock one</div>
        <div data-js="mock-javascript-functionality">Mock two</div>
        <div data-js="mock-other-javascript-functionality">Mock three</div>
      `
      })

      test('Should call Class with element', () => {
        const mockElements = Array.from(
          document.querySelectorAll(`[data-js="mock-javascript-functionality"]`)
        )

        initClass('mock-javascript-functionality', mockClass)

        expect(mockClass).toHaveBeenCalledWith(mockElements.at(0))
        expect(mockClass).toHaveBeenCalledTimes(1)
      })
    })

    describe('With no elements', () => {
      test('Should not call module', () => {
        initClass([], mockClass)
        expect(mockClass).not.toHaveBeenCalled()
      })
    })
  })

  describe('#initModule', () => {
    const mockModule = vi.fn()

    describe('With elements', () => {
      beforeEach(() => {
        document.getElementsByTagName('html')[0].innerHTML = `
        <div data-js="mock-module">Mock one</div>
        <div data-js="mock-module-other">Mock two</div>
        <div data-js="mock-module-different">Mock three</div>
      `
      })

      test('Should call module and pass in element', () => {
        const mockElement = document.querySelector(`[data-js="mock-module"]`)

        initModule('mock-module', mockModule)

        expect(mockModule).toHaveBeenNthCalledWith(1, mockElement)
        expect(mockModule).toHaveBeenCalledTimes(1)
      })
    })

    describe('Without an attribute', () => {
      test('Should not call module', () => {
        initModule('', mockModule)

        expect(mockModule).not.toHaveBeenCalled()
      })
    })
  })

  describe('#initModules', () => {
    const mockModule = vi.fn()

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

        initModules('mock-javascript-functionality', mockModule)

        expect(mockModule).toHaveBeenNthCalledWith(1, mockElements.at(0))
        expect(mockModule).toHaveBeenNthCalledWith(2, mockElements.at(1))
        expect(mockModule).toHaveBeenNthCalledWith(3, mockElements.at(2))

        expect(mockModule).toHaveBeenCalledTimes(3)
      })
    })

    describe('With no elements', () => {
      test('Should not call module', () => {
        initModules([], mockModule)
        expect(mockModule).not.toHaveBeenCalled()
      })
    })
  })
})
