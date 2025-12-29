import {
  componentRegistry,
  getComponentsByCategory,
  findComponent
} from './component-registry.js'

describe('Component Registry', () => {
  describe('componentRegistry', () => {
    test('should be an array of components', () => {
      expect(Array.isArray(componentRegistry)).toBe(true)
      expect(componentRegistry.length).toBeGreaterThan(0)
    })

    test('each component should have required properties', () => {
      componentRegistry.forEach((component) => {
        expect(component).toHaveProperty('name')
        expect(component).toHaveProperty('title')
        expect(component).toHaveProperty('description')
        expect(component).toHaveProperty('category')
        expect(component).toHaveProperty('params')
        expect(component).toHaveProperty('examples')

        expect(typeof component.name).toBe('string')
        expect(typeof component.title).toBe('string')
        expect(typeof component.description).toBe('string')
        expect(typeof component.category).toBe('string')
        expect(Array.isArray(component.params)).toBe(true)
        expect(Array.isArray(component.examples)).toBe(true)
      })
    })

    test('each param should have required properties', () => {
      componentRegistry.forEach((component) => {
        component.params.forEach((param) => {
          expect(param).toHaveProperty('name')
          expect(param).toHaveProperty('type')
          expect(param).toHaveProperty('required')
          expect(param).toHaveProperty('description')
        })
      })
    })
  })

  describe('getComponentsByCategory', () => {
    test('should group components by category', () => {
      const grouped = getComponentsByCategory()

      expect(typeof grouped).toBe('object')
      expect(grouped).toHaveProperty('form')
      expect(grouped).toHaveProperty('display')
      expect(grouped).toHaveProperty('navigation')
    })

    test('each category should contain components', () => {
      const grouped = getComponentsByCategory()

      Object.values(grouped).forEach((components) => {
        expect(Array.isArray(components)).toBe(true)
        expect(components.length).toBeGreaterThan(0)
      })
    })
  })

  describe('findComponent', () => {
    test('should find component by name', () => {
      const button = findComponent('button')

      expect(button).toBeDefined()
      expect(button.name).toBe('button')
      expect(button.title).toBe('Button')
    })

    test('should return undefined for non-existent component', () => {
      const result = findComponent('non-existent')

      expect(result).toBeUndefined()
    })
  })
})
