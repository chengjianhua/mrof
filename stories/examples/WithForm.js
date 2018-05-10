/* eslint-disable react/prop-types */
import React, {Component} from 'react'

import {Field, withForm} from '../../src'

class WithFormExample extends Component {
  handleSubmit = e => {
    e.preventDefault()

    // const {form} = this.props

    // console.group('WithForm.handleSubmit')
    // console.log(form)
    // console.groupEnd()
  }

  render() {
    const {form} = this.props

    // console.log(form);

    return (
      <form onSubmit={this.handleSubmit}>
        <p>
          <Field name="nick">{props => <input type="text" {...props} />}</Field>
        </p>

        <p>
          <Field name="age">
            {props => <input type="number" {...props} />}
          </Field>
        </p>

        <p>
          <Field name="interest">
            <input />
          </Field>
        </p>

        <button type="submit">Submit</button>
      </form>
    )
  }
}

export default withForm()(WithFormExample)
