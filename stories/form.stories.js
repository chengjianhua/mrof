/* eslint-disable no-unused-vars, no-console */
import React from 'react'

import {storiesOf} from '@storybook/react'
import {withInfo} from '@storybook/addon-info'
import {Button} from '@storybook/react/demo'

import {create} from '../src'

import WithForm from './examples/WithForm'

const {Form, Field} = create()

storiesOf('Form', module)
  .add(
    'Provider',
    withInfo(`
    haha
`)(() => {
      return (
        <Form
          onSubmit={(...args) => {
            console.log(args)
          }}
        >
          <Field
            name="name"
            rule={({value, values}) => {
              console.log({value, values})

              if (!value) return 'is required'

              return null
            }}
          >
            {(props, field) => {
              console.log({...props, ...field})

              return <input {...props} />
            }}
          </Field>

          <button type="submit">Submit</button>
        </Form>
      )
    }),
  )
  .add(
    'withForm',
    withInfo(`
    Use the hoc to wrap the children
  `)(() => {
      return <WithForm />
    }),
  )
