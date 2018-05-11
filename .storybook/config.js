import React from 'react'
import {configure} from '@storybook/react'
import {setDefaults} from '@storybook/addon-info'
import {setOptions} from '@storybook/addon-options'

import PropTable from './components/PropTable'

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /.stories.js$/)
const loadStories = () => {
  req.keys().forEach(filename => req(filename))
}

setDefaults({
  inline: true,
  header: false,
  TableComponent: PropTable,
})

setOptions({
  name: 'mrof - Storybook',
  showAddonPanel: false,
  addonPanelInRight: true,
})

configure(loadStories, module)
