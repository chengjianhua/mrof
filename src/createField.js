// eslint-disable-next-line no-unused-vars
import React, {Component} from 'react'
import PropTypes from 'prop-types'

const identity = v => v

function createField({store}) {
  class Field extends Component {
    static propTypes = {
      children: PropTypes.node,
      name: PropTypes.string.isRequired,
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

      const {name, rule} = props

      store.setFieldMeta(name, {rule})
      store.setField(name, {})
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
      const value =
        typeof valueOrTarget === 'object' && valueOrTarget.target
          ? valueOrTarget.target.value
          : valueOrTarget
      const {name} = this.props
      const transformedValue = this.getInputToDataTransformer()(value)

      store.setField(name, {value: transformedValue, touched: true})

      this.forceUpdate()
    }

    getControllableProps() {
      const {name, trigger} = this.props
      const field = store.getField(name)
      const transformedValue = this.getDataToInputTransformer()(field.value)
      const controllableProps = {
        value: transformedValue,
        [trigger]: this.handler,
      }

      return controllableProps
    }

    getFieldProps() {
      const {name} = this.props
      const field = store.getField(name)
      let status, hint

      if (field.touched && field.error) {
        status = 'error'
        hint = field.error
      }

      return {status, hint}
    }

    componentDidUpdate({name, rule}) {
      store.setFieldMeta(name, {rule})
    }

    render() {
      const {children, render} = this.props
      const controllableProps = this.getControllableProps()
      const fieldProps = this.getFieldProps()
      const renderer = render || children

      return renderer(controllableProps, fieldProps)
    }
  }

  return Field
}

export default createField
