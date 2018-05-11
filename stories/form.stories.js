/* eslint-disable no-unused-vars, no-console */
import React from 'react'

import {storiesOf} from '@storybook/react'
import {withInfo} from '@storybook/addon-info'
import {Button} from '@storybook/react/demo'

import {create} from '../src'
import Field from '../src/Field'

import WithForm from './examples/WithForm'

storiesOf('Form', module)
  .add(
    'Button',
    withInfo(``)(() => {
      return <Button>haha</Button>
    }),
  )
  .add(
    'withForm',
    withInfo({
      text: `
Use the hoc to wrap the children
      `,
      propTables: [Field],
    })(() => {
      return <WithForm />
    }),
  )
