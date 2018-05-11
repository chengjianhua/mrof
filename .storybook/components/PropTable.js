import React from 'react'
import RawPropTable from '@storybook/addon-info/dist/components/PropTable'

/**
 * @see https://github.com/storybooks/storybook/issues/2708#issuecomment-386737471
 */
export default function PropTable({propDefinitions, ...props}) {
  // console.group('TableComponent');
  // console.log(propDefinitions);
  // console.log(props);
  // console.groupEnd();

  propDefinitions.forEach(def => {
    if (typeof def.propType === 'string') {
      def.propType = {name: def.propType}
    }
  })

  return <RawPropTable propDefinitions={propDefinitions} {...props} />
}
