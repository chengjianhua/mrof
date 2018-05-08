import React, {Component} from 'react'
import hoistStatics from 'recompose/hoistStatics'
import wrapDisplayName from 'recompose/wrapDisplayName'

export default function createFormWrapper(options) {
  const {store} = options

  return hoistStatics(
    WrappedComponent =>
      class extends Component {
        static WrappedComponent = WrappedComponent

        static displayName = wrapDisplayName(WrappedComponent, 'withForm')

        wrappedComponent
        refWrappedComponent = ref => (this.wrappedComponent = ref)

        setFieldsValueAndUpdate = (...args) => {
          store.setFieldsValue(...args)

          this.wrappedComponent.forceUpdate()
        }

        // eslint-disable-next-line class-methods-use-this
        getForm() {
          return {
            setFields: store.setFields,
            getFieldValue: store.getFieldValue,
          }
        }

        componentDidMount() {
          store.wrappedComponent = this.wrappedComponent
        }

        componentWillUnmount() {
          store.wrappedComponent = null
        }

        render() {
          return (
            <WrappedComponent
              ref={this.refWrappedComponent}
              form={this.getForm()}
              {...this.props}
            />
          )
        }
      },
  )
}
