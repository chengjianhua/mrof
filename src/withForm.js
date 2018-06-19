import React from 'react'
import hoistStatics from 'recompose/hoistStatics'
import wrapDisplayName from 'recompose/wrapDisplayName'

import Form from './Form'

export default function withForm(config) {
  return hoistStatics(WrappedComponent => {
    const WithForm = React.forwardRef((props, ref) => {
      return (
        <Form
          {...config}
          render={form => <WrappedComponent {...props} ref={ref} form={form} />}
        />
      )
    })

    WithForm.displayName = wrapDisplayName(WrappedComponent, 'Form')

    return WithForm
  })
}
