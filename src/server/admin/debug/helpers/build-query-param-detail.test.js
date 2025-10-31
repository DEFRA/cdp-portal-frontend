import { buildQueryParamDetail } from './build-query-param-detail.js'

describe('#buildQueryParamDetail', () => {
  test('Should return correct description for schema with string and array types', () => {
    const schema = {
      keys: {
        fieldName: {
          type: 'alternatives',
          matches: [
            { schema: { type: 'string', allow: ['value1', 'value2'] } },
            {
              schema: {
                type: 'array',
                items: [{ type: 'string', allow: ['value1', 'value2'] }]
              }
            }
          ]
        }
      }
    }
    const result = buildQueryParamDetail(schema)
    expect(result).toEqual({
      fieldName:
        'Enter a fieldName value or comma separated list. E.g. value1 or value1,value2'
    })
  })

  test('Should return correct description for schema with boolean type', () => {
    const schema = {
      keys: {
        isActive: {
          type: 'boolean'
        }
      }
    }
    const result = buildQueryParamDetail(schema)
    expect(result).toEqual({
      isActive: 'Enter a boolean'
    })
  })

  test('Should return correct description for schema with allowed values', () => {
    const schema = {
      keys: {
        status: {
          type: 'string',
          allow: ['active', 'inactive']
        }
      }
    }
    const result = buildQueryParamDetail(schema)
    expect(result).toEqual({
      status: 'Enter a status value. E.g. active,inactive'
    })
  })

  test('Should handle schema with unknown types gracefully', () => {
    const schema = {
      keys: {
        unknownField: {
          type: 'unknown'
        }
      }
    }
    const result = buildQueryParamDetail(schema)
    expect(result).toEqual({
      unknownField: 'Enter unknown'
    })
  })

  test('Should handle empty schema gracefully', () => {
    const schema = { keys: {} }
    const result = buildQueryParamDetail(schema)
    expect(result).toEqual({})
  })
})
