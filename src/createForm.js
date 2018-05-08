import React, {Component} from 'react'
import PropTypes from 'prop-types'

const emptyFunction = () => {}

function createForm({store}) {
  class Form extends Component {
    static propTypes = {
      onSubmit: PropTypes.func,
      children: PropTypes.node,
    }

    static defaultProps = {
      onSubmit: emptyFunction,
      children: null,
    }

    handleSubmit = e => {
      e.preventDefault()

      const {onSubmit} = this.props

      store
        .validate()
        .then(result => {
          onSubmit(result, e)
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error(error)
        })
    }

    componentWillUnmount() {
      store.resetTouched()
    }

    render() {
      // eslint-disable-next-line no-unused-vars
      const {children, onSubmit, ...props} = this.props

      return (
        <form onSubmit={this.handleSubmit} {...props}>
          {children}
        </form>
      )
    }
  }

  return Form
}

export default createForm
