import set from 'ramda/es/set'
import lensPath from 'ramda/es/lensPath'
import isEqual from 'react-fast-compare'

export function deriveValuesFromFields(fields) {
  const keys = Object.keys(fields)

  const values = keys.reduce(
    (acc, fieldPath) =>
      set(lensPath(fieldPath.split('.')), fields[fieldPath].value, acc),
    {},
  )

  return values
}

export function deriveErrorsFromFields(fields) {
  const fieldNames = Object.keys(fields)
  const result = fieldNames.reduce((acc, fieldName) => {
    const {error} = fields[fieldName]

    if (!error) return acc

    return Object.assign(acc, {[fieldName]: error})
  }, {})

  return isEqual(result, {}) ? null : result
}
