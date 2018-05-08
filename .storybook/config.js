import {configure} from '@storybook/react'
import {setDefaults} from '@storybook/addon-info'

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /.stories.js$/)
const loadStories = () => {
  req.keys().forEach(filename => req(filename))
}

setDefaults({
  inline: true,
  header: false,
})

configure(loadStories, module)
