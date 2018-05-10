import warning from 'warning'

import {deriveValuesFromFields} from './utils'

export function updateFields(fieldsMeta, fields, incomingFields) {
  const newFields = {...fields}

  Object.keys(incomingFields).forEach(fieldName => {
    const field = incomingFields[fieldName]

    warning(
      fieldsMeta[fieldName],
      `The field \`${fieldName}\` was assigned before being registered`,
    )

    if (!newFields[fieldName]) {
      newFields[fieldName] = {}
    }

    const originalField = fields[fieldName]
    const {rule} = fieldsMeta[fieldName]
    const finalField = {...originalField, ...field}
    const validationInfo = {
      value: finalField.value,
      values: deriveValuesFromFields(newFields),
    }
    const validationResult = rule ? rule(validationInfo) : null

    Object.assign(finalField, {error: validationResult}, field)

    newFields[fieldName] = finalField
  })

  return newFields
}

export function resetFields() {}
