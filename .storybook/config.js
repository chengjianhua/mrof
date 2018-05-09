import {configure} from '@storybook/react'
import {setDefaults} from '@storybook/addon-info'
import {setOptions} from '@storybook/addon-options'

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /.stories.js$/)
const loadStories = () => {
  req.keys().forEach(filename => req(filename))
}

setDefaults({
  inline: true,
  header: false,
})

setOptions({
  name: 'mrof - Storybook',
  showAddonPanel: true,
  addonPanelInRight: true,
})

configure(loadStories, module)
