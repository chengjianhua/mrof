import React, {Component} from 'react'
// import warning from 'warning'
import hoistStatics from 'recompose/hoistStatics'
import wrapDisplayName from 'recompose/wrapDisplayName'

import FormContext from './context'
// import {deriveValuesFromFields, deriveErrorsFromFields} from './utils'
import {updateFields} from './actions'

export default function withForm() {
  return hoistStatics(
    WrappedComponent =>
      class extends Component {
        static WrappedComponent = WrappedComponent
        static displayName = wrapDisplayName(WrappedComponent, 'withForm')

        fieldsMeta = {}

        constructor(props, context) {
          super(props, context)

          this.state = {
            fields: {},
            ...this.actions,
          }
        }

        removeField = fieldName => {
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
                  new Error(
                    '[form]: The input of fields has failed the validation.',
                  ),
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

        get actions() {
          return {
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

        render() {
          const context = {
            ...this.state,
            ...this.actions,
          }

          return (
            <FormContext.Provider value={this.state}>
              <WrappedComponent form={context} {...this.props} />
            </FormContext.Provider>
          )
        }
      },
  )
}
