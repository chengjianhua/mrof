import {set, isEqual} from 'lodash-es'
import warning from 'warning'

class FormStore {
  fields = {}

  fieldsMeta = {}

  wrappedComponent = null

  get values() {
    const {fields} = this
    const keys = Object.keys(fields)

    const values = keys.reduce(
      (acc, fieldPath) => set(acc, fieldPath, fields[fieldPath].value),
      {},
    )

    return values
  }

  get errors() {
    const fieldNames = Object.keys(this.fields)
    const result = fieldNames.reduce((acc, fieldName) => {
      const {error} = this.fields[fieldName]

      if (!error) return acc

      return Object.assign(acc, {[fieldName]: error})
    }, {})

    return isEqual(result, {}) ? null : result
  }

  removeField(field) {
    delete this.fields[field]
  }

  updateComponent() {
    return new Promise(resolve => {
      if (this.wrappedComponent) {
        this.wrappedComponent.forceUpdate(resolve)
      }
    })
  }

  getFieldMeta(fieldName) {
    return this.fieldsMeta[fieldName]
  }

  getField(fieldName) {
    return this.fields[fieldName]
  }

  getFieldValue = field => this.getFieldInfo(field).value

  setFieldMeta(fieldName, fieldMeta) {
    this.fieldsMeta[fieldName] = fieldMeta
  }

  setField(fieldName, field) {
    warning(
      this.fieldsMeta[fieldName],
      `The field \`${fieldName}\` was assigned before being registered`,
    )

    if (!this.fields[fieldName]) {
      this.fields[fieldName] = {}
    }

    const originalField = this.fields[fieldName]
    const {rule} = this.getFieldMeta(fieldName)
    const finalField = Object.assign(originalField, field)
    const validationInfo = {value: finalField.value, values: this.values}
    const validationResult = rule ? rule(validationInfo) : null

    Object.assign(finalField, {error: validationResult}, field)
    this.fields[fieldName] = finalField
  }

  setFieldsValue = newFieldsValue => {
    Object.keys(newFieldsValue, fieldName => {
      const value = newFieldsValue[fieldName]
      this.setField(fieldName, {value})
    })

    this.updateComponent()
  }

  setFields = newFields => {
    Object.keys(newFields, fieldName => {
      const field = newFields[fieldName]

      this.setField(fieldName, field)
    })

    this.updateComponent()
  }

  resetTouched() {
    Object.keys(this.fields, fieldName => {
      this.setField(fieldName, {touched: false})
    })
  }

  validate() {
    Object.keys(this.fields, fieldName => {
      this.setField(fieldName, {touched: true})
    })

    this.updateComponent()

    return new Promise((resolve, reject) => {
      const {values, errors} = this

      if (errors) {
        reject(
          Object.assign(
            new Error('[form]: The input of fields has failed the validation.'),
            {
              errors,
            },
          ),
        )

        return
      }

      resolve({values})
    })
  }
}

export default FormStore
