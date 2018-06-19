import React, {Component} from 'react'
import PropTypes from 'prop-types'

import FormContext from './context'
import {updateFields} from './actions'

const {Provider} = FormContext

export default class Form extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    render: PropTypes.func,
  }

  fieldsMeta = {}

  constructor(props, context) {
    super(props, context)

    this.state = {
      fields: {},
      getFieldMeta: this.getFieldMeta,
      setFieldMeta: this.setFieldMeta,
      getField: this.getField,
      setField: this.setField,
      setFields: this.setFields,
      setFieldValue: this.setFieldsValue,
      resetTouched: this.resetTouched,
      validate: this.validate,
    }
  }

  removeField = fieldName => {
    // eslint-disable-next-line no-unused-vars
    const {[fieldName]: deletedField, ...newFields} = this.state.fields

    this.setState({fields: newFields})
  }

  getFieldMeta = fieldName => {
    return this.fieldsMeta[fieldName]
  }

  getField = fieldName => {
    return this.state.fields[fieldName] || {}
  }

  setFieldMeta = (fieldName, fieldMeta) => {
    this.fieldsMeta[fieldName] = fieldMeta
  }

  setFields = newFields => {
    this.setState({
      fields: updateFields(this.fieldsMeta, this.state.fields, newFields),
    })
  }

  setField = (fieldName, field) => {
    this.setState({
      fields: updateFields(this.fieldsMeta, this.state.fields, {
        [fieldName]: field,
      }),
    })
  }

  setFieldsValue = newFieldsValue => {
    const newFields = Object.keys(newFieldsValue).map(fieldName => {
      const value = newFieldsValue[fieldName]

      return {value}
    })

    this.setState({
      fields: updateFields(this.fieldsMeta, this.state.fields, newFields),
    })
  }

  resetTouched = () => {
    const {fields} = this.state

    const fieldsUntouched = Object.keys(fields).map(fieldName => {
      return {
        ...fields[fieldName],
        touched: false,
      }
    })

    this.setState({
      fields: updateFields(this.fieldsMeta, this.state, fieldsUntouched),
    })
  }

  validate = () => {
    this.setState(({fields}) => {
      const fieldsTouched = Object.keys(fields).map(fieldName => {
        return {
          ...fields[fieldName],
          touched: false,
        }
      })

      return {
        fields: updateFields(this.fieldsMeta, fields, fieldsTouched),
      }
    })

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

  getContext() {
    return this.state
  }

  renderChildren(context) {
    const {children, render} = this.props

    if (render) return render(context)

    if (typeof children === 'function') return children(context)

    return children
  }

  render() {
    const context = this.getContext()

    return <Provider value={context}>{this.renderChildren(context)}</Provider>
  }
}
