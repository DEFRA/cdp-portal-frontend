function extractSchemaInfo(schemaObject) {
  const result = {}

  for (const [keyName, keySchema] of Object.entries(schemaObject)) {
    const keyInfo = { acceptedFormats: [] }

    const addFormat = (type, allowedValues) => {
      const format = { type }

      if (allowedValues) {
        format.allowedValues = allowedValues
      }

      keyInfo.acceptedFormats.push(format)
    }

    if (keySchema.type === 'alternatives') {
      for (const { schema } of keySchema.matches) {
        if (schema.type === 'array') {
          addFormat('array', schema.items?.[0]?.allow || [])

          keyInfo.acceptedFormats.at(
            keyInfo.acceptedFormats.length - 1
          ).itemType = schema.items?.[0]?.type || 'unknown'
        } else {
          addFormat(schema.type, schema.allow)
        }
      }
    } else {
      addFormat(keySchema.type, keySchema.allow)
    }

    result[keyName] = keyInfo
  }

  return result
}

function buildHintString(hasType, fieldName, formats) {
  let description = 'Enter '
  switch (true) {
    case hasType('array') && hasType('string'):
      description += `a ${fieldName} value or comma separated list`
      break
    case hasType('array'):
      description += 'a comma separated list'
      break
    case hasType('string'):
      description += `a ${fieldName} value`
      break
    case hasType('boolean'):
      description += 'a boolean'
      break
    default:
      description += formats[0].type
  }
  return description
}

function createHint(schemaInfo) {
  const hints = {}

  for (const [fieldName, fieldInfo] of Object.entries(schemaInfo)) {
    const formats = fieldInfo.acceptedFormats
    const hasType = (type) => formats.some((format) => format.type === type)
    const allowedValues = formats.find(
      (format) => format.allowedValues
    )?.allowedValues

    let hint = buildHintString(hasType, fieldName, formats)

    if (allowedValues?.length) {
      hint += `. E.g. ${
        hasType('array') && hasType('string')
          ? `${allowedValues[0]} or ${allowedValues.join(',')}`
          : allowedValues.join(',')
      }`
    }

    hints[fieldName] = hint
  }

  return hints
}

function buildQueryParamDetail(description) {
  return createHint(extractSchemaInfo(description.keys))
}

export { buildQueryParamDetail }
