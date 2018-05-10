import React, {Component} from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'

import FormContext from './context'

const identity = v => v

class Field extends Component {
  static propTypes = {
    form: PropTypes.shape({}).isRequired,
    children: PropTypes.node,
    name: PropTypes.string.isRequired,
    field: PropTypes.shape({
      error: PropTypes.string,
      touched: PropTypes.bool,
      value: PropTypes.any,
    }),
    transformer: PropTypes.arrayOf(PropTypes.func),
    rule: PropTypes.func,
    trigger: PropTypes.string,
    render: PropTypes.func.isRequired,
  }

  static defaultProps = {
    children: null,
    transformer: [identity, identity],
    rule: false,
    trigger: 'onChange',
  }

  constructor(props, context) {
    super(props, context)

    const {name, rule, form} = props

    form.setFieldMeta(name, {rule})
  }

  getDataToInputTransformer() {
    const {transformer} = this.props
    const [transformData = identity] = transformer

    return transformData
  }

  getInputToDataTransformer() {
    const {transformer} = this.props
    const [, transformInput = identity] = transformer

    return transformInput
  }

  handler = valueOrTarget => {
    const {form} = this.props
    const value =
      typeof valueOrTarget === 'object' && valueOrTarget.target
        ? valueOrTarget.target.value
        : valueOrTarget
    const {name} = this.props
    const transformedValue = this.getInputToDataTransformer()(value)

    form.setField(name, {value: transformedValue, touched: true})
  }

  getControllableProps() {
    const {trigger, field} = this.props
    const transformedValue = this.getDataToInputTransformer()(field.value)
    const controllableProps = {
      value: transformedValue,
      [trigger]: this.handler,
    }

    return controllableProps
  }

  getFieldProps() {
    const {field} = this.props
    let status, hint

    if (field.touched && field.error) {
      status = 'error'
      hint = field.error
    }

    return {status, hint}
  }

  shouldComponentUpdate(nextProps) {
    const {props} = this

    if (props.children instanceof Function) return true

    return !isEqual(nextProps, props)
  }

  componentDidUpdate({name, rule}) {
    const {form} = this.props

    form.setFieldMeta(name, {rule})
  }

  render() {
    const {children, render} = this.props
    const controllableProps = this.getControllableProps()
    const fieldProps = this.getFieldProps()

    if (render) {
      return render(controllableProps, fieldProps)
    }

    if (typeof children === 'function') {
      return children(controllableProps, fieldProps)
    }

    if (children) {
      return React.cloneElement(children, {...controllableProps})
    }

    return null
  }
}

export default React.forwardRef(function FieldWrapper(props, ref) {
  const {name} = props

  return (
    <FormContext.Consumer>
      {({fields, ...form}) => (
        <Field {...props} field={form.getField(name)} form={form} ref={ref} />
      )}
    </FormContext.Consumer>
  )
})
