// import createContext from 'create-react-context';
// import uuid from 'uuid/v1';

import FormStore from './FormStore'
import createForm from './createForm'
import createField from './createField'
import createFormHoc from './createFormHoc'

// const getContextName = (name = uuid()) => `form-${name}`;

function create({name} = {}) {
  const store = new FormStore(name)
  const Form = createForm({store})
  const Field = createField({store})
  const wrap = createFormHoc({store})

  Form.wrap = wrap

  return {Form, Field, wrap}
}

export default create
